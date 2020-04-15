module.exports = {
  rules: {
    // needing to do bitwise operating is
    // required in a bit level library
    "no-bitwise": "off",
    // There are some classes in this library
    "functional/no-class": "off",
    "functional/no-this-expression": "off",
  },
};
