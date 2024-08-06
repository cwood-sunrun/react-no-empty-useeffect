# No anonymous useEffect callback functions

> ESLint rule to enforce named callback functions in React `useEffect` hooks.

##  Get started

```
npm install
```

```
npm run test
```

### Known Limitations

- Does not support aliases to `useEffect` 
- Expects import/require to come from `"react"` package (i.e. not fully-specified path, etc.)

## Useful tools

- [AST Explorer](https://astexplorer.net/)
- [TypeScript compiler](https://github.com/microsoft/TypeScript/tree/main/src/compiler)
- [ESLint custom rules](https://eslint.org/docs/latest/extend/custom-rule-tutorial)
