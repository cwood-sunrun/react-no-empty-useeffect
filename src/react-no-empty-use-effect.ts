import { ESLintUtils} from "@typescript-eslint/utils";
import * as ts from "typescript";

const createRule = ESLintUtils.RuleCreator(
  (name) => name,
);


// TODO: Refactor to loop
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

        const checker = services.program.getTypeChecker();
        // TODO: fix this type complaint
        if (node?.callee?.name === 'useEffect') {
          const tsNode = services.esTreeNodeToTSNodeMap.get(node.callee);
          const symbol = checker.getSymbolAtLocation(tsNode);

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
      // @ts-ignore
      recommended: 'error',
      requiresTypeChecking: true,
    },
    messages: {
      anonymousUseEffectCallback: "Anonymous useEffect callback.",
    },
    type: "suggestion",
    schema: [],
  },
  name: "react-no-empty-use-effect",
  defaultOptions: [],
});


export const configs = {
  recommended: {
    plugins: ['react-no-empty-use-effect'],
    rules: {
      'react-no-empty-use-effect/react-no-empty-use-effect': 'error',
    },
  },
};

export const rules = {
  'react-no-empty-use-effect': rule,
};