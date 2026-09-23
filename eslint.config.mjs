import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // TypeScript
  ...tseslint.configs.strictTypeChecked,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },

    plugins: {
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      security,
    },

    rules: {
      // ============================================
      // TypeScript
      // ============================================

      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",

      "@typescript-eslint/no-floating-promises": "error",

      "@typescript-eslint/await-thenable": "error",

      "@typescript-eslint/no-misused-promises": "error",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // ============================================
      // Imports / Architecture
      // ============================================

      "import/no-duplicates": "error",

      "import/no-cycle": [
        "error",
        {
          maxDepth: 10,
        },
      ],

      "import/no-self-import": "error",

      "import/no-mutable-exports": "error",

      "import/no-useless-path-segments": "error",

      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "object",
            "type",
          ],

          pathGroups: [
            {
              pattern: "next/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],

          pathGroupsExcludedImportTypes: ["builtin"],

          "newlines-between": "always",

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // ============================================
      // Accessibility
      // ============================================

      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/label-has-associated-control": "error",

      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",

      // ============================================
      // Security
      // ============================================

      "security/detect-eval-with-expression": "error",
      "security/detect-new-buffer": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-child-process": "error",

      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-regexp": "warn",

      // Intentionally disabled because it produces
      // many false positives in normal TypeScript code.
      "security/detect-object-injection": "off",

      // ============================================
      // JavaScript correctness
      // ============================================

      "no-debugger": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-new-wrappers": "error",

      "no-var": "error",
      "prefer-const": "error",

      "no-unreachable": "error",
      "no-unreachable-loop": "error",

      eqeqeq: ["error", "always"],

      curly: ["error", "all"],

      "no-param-reassign": "error",

      "object-shorthand": "error",
      "prefer-template": "error",

      "no-else-return": "error",
      "no-lonely-if": "error",
      "no-unneeded-ternary": "error",
      "no-nested-ternary": "error",

      // ============================================
      // Production logging
      // ============================================

      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      // ============================================
      // Maintainability
      // ============================================

      complexity: [
        "warn",
        {
          max: 15,
        },
      ],

      "max-depth": [
        "warn",
        {
          max: 4,
        },
      ],

      "max-nested-callbacks": [
        "warn",
        {
          max: 4,
        },
      ],
    },
  },

  // ================================================
  // Tests
  // ================================================

  {
    files: [
      "**/*.test.{ts,tsx}",
      "**/*.spec.{ts,tsx}",
      "**/__tests__/**/*.{ts,tsx}",
    ],

    rules: {
      "no-console": "off",
    },
  },

  // ================================================
  // Global ignores
  // ================================================

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "dist/**",
  ]),
]);

export default eslintConfig;
