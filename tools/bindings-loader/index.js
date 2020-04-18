/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
// Credits: https://github.com/simonbuchan/bindings-loader
// this is a fixed version which doesn't break sources:
// https://github.com/simonbuchan/bindings-loader/issues/4

const path = require("path");
const vm = require("vm");
const { promisify } = require("util");

const {
  OriginalSource,
  SourceMapSource,
  ReplaceSource,
} = require("webpack-sources");

module.exports = function bindingsLoader(source, map, meta) {
  // Using exec() in parallel, so we need separate RegExp instances.
  // That means don't "optimize" this by moving this to the global scope!
  const pattern = /\brequire\((?:'bindings'|"bindings")\)\s*\(([^)]*)\)/g;
  let match = pattern.exec(source);
  if (!match) {
    return this.callback(null, source, map, meta);
  }

  const resolve = promisify(this.resolve).bind(this, this.context);
  const readFile = promisify(this.fs.readFile).bind(this.fs);

  const callback = this.async();

  (async () => {
    const bindings = require(await resolve("bindings"));

    const replaceSource = new ReplaceSource(
      map
        ? new SourceMapSource(source, this.resourcePath, map)
        : new OriginalSource(source, this.resourcePath)
    );

    do {
      // Safer eval().
      let arg = vm.runInNewContext(match[1]);
      if (typeof arg === "string") {
        arg = { bindings: arg };
      }
      const forPath = !!arg.path;
      arg.path = true;
      arg.module_root = arg.module_root
        ? await resolve(arg.module_root)
        : bindings.getRoot(this.resourcePath);

      const addonPath = bindings(arg);
      const addonRequest = `./${path.basename(addonPath)}`;
      const addonContent = await readFile(addonPath);
      this.emitFile(addonRequest, addonContent);

      replaceSource.replace(
        match.index,
        pattern.lastIndex - 1,
        forPath
          ? JSON.stringify(addonRequest)
          : `require(${JSON.stringify(addonRequest)})`
      );

      match = pattern.exec(source);
    } while (match);

    return replaceSource.sourceAndMap();
  })().then(
    (result) => {
      callback(null, result.source, result.map);
    },
    (err) => {
      callback(err);
    }
  );

  return undefined;
};
