/**
 * Used to edit our package.json files to
 * use the `publishConfig` values. Useful for
 * executing in a built context
 */
const { execSync } = require("child_process");
const { promisify } = require("util");
const { readFile, writeFile } = require("fs");
const path = require("path");

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

const readJsonFile = async (filePath) =>
  JSON.parse((await readFileAsync(filePath)).toString());

const writeJsonFile = (filePath, data) =>
  writeFileAsync(filePath, JSON.stringify(data, undefined, 2));

const shouldWrite = process.argv.some((value) => value === "--write");

(async () => {
  const workspaces = execSync("yarn workspaces list --json")
    .toString()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line).location)
    .filter((location) => location !== ".");

  await Promise.all(
    workspaces.map(async (workspace) => {
      const packagePath = path.join(workspace, "package.json");
      const package = await readJsonFile(packagePath);
      if (package.publishConfig) {
        const newPackage = { ...package, ...package.publishConfig };
        if (shouldWrite) {
          console.log(`Updating ${packagePath}`);
          await writeJsonFile(packagePath, newPackage);
        } else {
          console.log(`Will update ${packagePath}`, newPackage);
        }
      }
    })
  );
})();
