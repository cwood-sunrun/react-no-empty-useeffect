import { readFileSync } from "fs";
import * as vitest from "vitest";
import { RuleTester } from "@typescript-eslint/rule-tester";
import { rule } from "./src/enforce-string-in-text";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
  },
});

ruleTester.run("react-no-empty-use-effect", rule, {
  invalid: [
    {
      code: readFileSync("./tests/empty-use-effect.tsx", "utf8"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: 1,
    },
  ],
  valid: [
    {
      code: readFileSync("./tests/named-use-effect.tsx", "utf8"),
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      errors: 0,
    },
  ],
});
