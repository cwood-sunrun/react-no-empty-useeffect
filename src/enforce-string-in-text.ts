import { ESLintUtils } from "@typescript-eslint/utils";
import * as ts from "typescript";

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://sunrun.com/rule/${name}`,
);


// function getReturnTypeOfFunction(type, checker) {
//   // TODO: How to handle multiple signatures?
//   const signatures = checker.getSignaturesOfType(type, 0);
//   const returnType = checker.getReturnTypeOfSignature(signatures[0]);
//   return returnType;
// }

function getParent(symbol) {
  if (symbol.parent) {
    return getParent(symbol.parent);
  }

  return symbol;
}


function isReactImport(symbol) {
  let isFromReact = false;
  // TODO: what would multiple declarations mean?
  if (symbol && symbol.declarations) {
    symbol?.declarations.forEach(dec => {
      let parent = getParent(dec);
      if (parent && parent.externalModuleIndicator) {
        if (parent.externalModuleIndicator?.moduleSpecifier?.text === 'react') {
          isFromReact = true;
        }
      }
    });
  }

  return isFromReact;
}

export const rule = createRule({
  create(context) {
    return {
      CallExpression: function(node) {
        const services = ESLintUtils.getParserServices(context);

        // TODO: fix this type complaint
        if (node?.callee?.name === 'useEffect') {
          const symbol = services.getSymbolAtLocation(node.callee);

          let [cb] = node.arguments;

          // id is null on anon arrow functions 
          // TODO: Fix typing 
          if (cb && cb?.id === null && isReactImport(symbol)) {
            context.report({
              node,
              messageId: "anonymousUseEffectCallback",
              data: {}
            });
          }
        }
      }
    }
  },
  meta: {
    docs: {
      description: "Use named functions for useEffect callbacks.",
    },
    messages: {
      anonymousUseEffectCallback: "Anonymous useEffect callback.",
    },
    type: "suggestion",
    schema: [],
  },
  name: "enforce-string-in-text",
  defaultOptions: [],
});
