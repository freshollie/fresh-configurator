const base = require("../../jest.base");
const { name } = require("./package.json");

module.exports = {
  displayName: {
    name,
    color: "blue",
  },
  ...base,
};
