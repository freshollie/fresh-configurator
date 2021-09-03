const operationNameRegex =
  /^\s*(query|mutation|subscription|fragment)[\s\r\n]*([_A-Za-z][_0-9A-Za-z]*)?/gim;
const schemaRegex = /^\s*type [_A-Za-z][_0-9A-Za-z]* \{/;
// This is not a real parser - just a quick-and-dirty regex.
function parseOperationNames(node) {
  return node.quasis.flatMap((quasi) => {
    const matches = operationNameRegex[Symbol.matchAll](quasi.value.cooked);
    return Array.from(matches).map(([, operationType, operationName]) => ({
      operationName,
      operationType,
    }));
  });
}

function isSchema(node) {
  return !!node.quasi.quasis.find((quasi) => !!schemaRegex.exec(quasi));
}

function handleTemplateTag(node, report) {
  const documents = parseOperationNames(node.quasi);
  if (documents.length > 1) {
    report({
      messageId: "singleOperation",
      node,
    });
    return undefined;
  }
  if (documents.length === 0) {
    report({
      messageId: "operationOrSingleFragment",
      node,
    });
    return undefined;
  }
  return documents[0];
}

exports.handleTemplateTag = handleTemplateTag;
exports.isSchema = isSchema;
