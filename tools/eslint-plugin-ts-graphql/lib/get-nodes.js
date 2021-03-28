// loosely based off https://github.com/discord/eslint-traverse/blob/master/index.js
function* getNodes(context, node) {
  const allVisitorKeys = context.getSourceCode().visitorKeys;
  const queue = [node];
  while (queue.length) {
    const currentNode = queue.shift();
    if (currentNode) {
      yield currentNode;
      const visitorKeys = allVisitorKeys[currentNode.type];
      if (!visitorKeys) continue;
      for (const visitorKey of visitorKeys) {
        const child = currentNode[visitorKey];
        if (!child) {
          continue;
        } else if (Array.isArray(child)) {
          queue.push(...child);
        } else {
          queue.push(child);
        }
      }
    }
  }
}
exports.getNodes = getNodes;
