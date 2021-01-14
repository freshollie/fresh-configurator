/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const pnp = require(`pnpapi`);
const { rebuild } = require("electron-rebuild");
const {
  dependencies,
  devDependencies,
  name: workspaceName,
} = require("./package.json");

const findDeps = (workspace, productionDeps, searchedDeps = []) => {
  const seen = new Set();
  const resolvedDeps = [];

  const getKey = (locator) => JSON.stringify(locator);

  const isPeerDependency = (pkg, parentPkg, name) =>
    getKey(pkg.packageDependencies.get(name)) ===
    getKey(parentPkg.packageDependencies.get(name));

  const traverseDependencyTree = (locator, parentPkg = null) => {
    // Prevent infinite recursion when A depends on B which depends on A
    const key = getKey(locator);
    if (seen.has(key)) return;

    const { name: packageName } = locator;
    const pkg = pnp.getPackageInformation(locator);

    if (searchedDeps.includes(packageName)) {
      resolvedDeps.push([packageName, pkg.packageLocation]);
    }

    console.assert(pkg, `The package information should be available`);

    seen.add(key);

    pkg.packageDependencies.forEach((referencish, name) => {
      // Unmet peer dependencies
      if (referencish === null) {
        return;
      }

      // Avoid iterating on peer dependencies - very expensive
      if (parentPkg !== null && isPeerDependency(pkg, parentPkg, name)) {
        return;
      }

      // Skip non production deps for the workspace
      if (parentPkg === null && !productionDeps[name]) {
        return;
      }

      const childLocator = pnp.getLocator(name, referencish);
      traverseDependencyTree(childLocator, pkg);
    });
  };

  traverseDependencyTree(workspace);

  return resolvedDeps;
};

(async () => {
  const REBUILD_MODULES = ["@serialport/bindings"];
  console.log("Rebuilding native modules for electron");

  const ELECTRON_VERSION = devDependencies.electron.replace("^", "");

  const workspace = pnp
    .getDependencyTreeRoots()
    .find(({ name }) => name === workspaceName);

  const modulesToBuild = findDeps(workspace, dependencies, REBUILD_MODULES);
  const results = await Promise.all(
    modulesToBuild.map(([name, folder]) => {
      console.log(`Rebuilding ${name}...`);
      return rebuild({
        buildPath: folder,
        electronVersion: ELECTRON_VERSION,
      })
        .then(() => ({ name }))
        .catch((e) => ({ name, error: e }));
    })
  );
  results.forEach(({ name, error }) => {
    if (error) {
      console.error(`Could not rebuild ${name}`, error);
    }
  });

  if (results.some(({ error }) => error)) {
    process.exit(1);
  } else {
    console.log("Native modules built");
  }
})();
