const { ESLintUtils } = require("@typescript-eslint/experimental-utils");
const { isMatch } = require("lodash");
const path = require("path");
const { getNodes } = require("./get-nodes");
const { handleTemplateTag, isSchema } = require("./parse");

// TODO:
const createRule = ESLintUtils.RuleCreator((name) => `docs/rules/${name}.md`);
const messages = {
  singleOperation: "GraphQL documents must have only one operation",
  mustBeNamed: "GraphQL operations must have a name",
  mustUseAs: "You must cast gql tags with the generated type",
  mustUseAsCorrectly:
    "The type assertion on a gql tag is not in the expected format",
  operationOrSingleFragment:
    "GraphQL documents must either have a single operation or a single fragment",
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function addNameToGqlTag(document, node, context) {
  if (!document.operationName) {
    context.report({
      messageId: "mustBeNamed",
      node,
    });
    return false;
  }
  if (document.operationType === "fragment") {
    // Fragments do not need a type assertion
    return true;
  }
  const filename = path.parse(path.basename(context.getFilename())).name;
  const name = `${document.operationName}${capitalize(document.operationType)}`;
  const pathname = `./__generated__/${filename}`;
  const sanitizedPathname = JSON.stringify(pathname);
  const typedDocumentNodePackageName = "@graphql-typed-document-node/core";
  const type = `import(${JSON.stringify(
    typedDocumentNodePackageName
  )}).TypedDocumentNode<
  import(${sanitizedPathname}).${name},
  import(${sanitizedPathname}).${name}Variables
>`;
  // Add a type assertion if there isn't one.
  if (node.parent && node.parent.type !== "TSAsExpression") {
    context.report({
      messageId: "mustUseAs",
      node,
      fix(fix) {
        return fix.insertTextAfter(node, ` as ${type}`);
      },
    });
    return false;
  }
  // The gql template has a type assertion - check if it has the correct format.
  if (
    !isMatch(node.parent.typeAnnotation, {
      type: "TSImportType",
      parameter: {
        literal: {
          value: typedDocumentNodePackageName,
        },
      },
      qualifier: {
        type: "Identifier",
        name: "TypedDocumentNode",
      },
      typeParameters: {
        params: [
          {
            type: "TSImportType",
            parameter: {
              literal: {
                value: pathname,
              },
            },
            qualifier: {
              type: "Identifier",
              name,
            },
          },
          {
            type: "TSImportType",
            parameter: {
              literal: {
                value: pathname,
              },
            },
            qualifier: {
              type: "Identifier",
              name: `${name}Variables`,
            },
          },
        ],
      },
    })
  ) {
    const { typeAnnotation } = node.parent;
    context.report({
      messageId: "mustUseAsCorrectly",
      node: typeAnnotation,
      fix(fix) {
        return fix.replaceText(typeAnnotation, type);
      },
    });
    return false;
  }
  return true;
}

function checkFragment(document, node, context) {
  addNameToGqlTag(document, node, context);
}

function checkDocument(document, node, context) {
  if (document.operationType === "fragment") {
    checkFragment(document, node, context);
    return;
  }
  addNameToGqlTag(document, node, context);
}

exports.rules = {
  "gql-type-assertion": createRule({
    name: "gql-type-assertion",
    meta: {
      fixable: "code",
      docs: {
        requiresTypeChecking: true,
        category: "Best Practices",
        recommended: "error",
        description:
          "Fixing this error adds a type assertion to gql template tags that provides accurate type inference for query variables, and for result data.",
      },
      messages,
      type: "problem",
      schema: [],
    },
    defaultOptions: [],
    create(context) {
      return {
        Program(programNode) {
          const report = (arg) => context.report(arg);
          for (const node of getNodes(context, programNode)) {
            if (node.type === "TaggedTemplateExpression") {
              if (
                node.tag.type === "Identifier" &&
                node.tag.name === "gql" &&
                !isSchema(node)
              ) {
                const document = handleTemplateTag(node, report);
                if (document) {
                  checkDocument(document, node, context);
                }
              }
            }
          }
        },
      };
    },
  }),
};
