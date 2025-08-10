import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly"
      }
    },
    rules: {
      // ES6+ and modern JavaScript rules
      "arrow-body-style": ["error", "as-needed"],
      "arrow-parens": ["error", "as-needed"],
      "arrow-spacing": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "object-shorthand": ["error", "always"],
      "prefer-destructuring": ["error", {
        "array": true,
        "object": true
      }, {
        "enforceForRenamedProperties": false
      }],

      // Code quality rules
      "no-unused-vars": ["error", { 
        "args": "after-used", 
        "ignoreRestSiblings": true,
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-void": "error",
      "no-with": "error",

      // Async/await rules
      "require-await": "error",
      "no-return-await": "error",
      "prefer-promise-reject-errors": "error",

      // Error handling
      "no-throw-literal": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",

      // Style and formatting
      "indent": ["error", 2, { "SwitchCase": 1 }],
      "quotes": ["error", "single", { "avoidEscape": true }],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "never"],
      "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
      "curly": ["error", "all"],
      "eqeqeq": ["error", "always"],
      "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }],

      // Naming conventions
      "camelcase": ["error", { "properties": "never" }],
      "new-cap": ["error", { "newIsCap": true, "capIsNew": false }],

      // Best practices
      "consistent-return": "error",
      "default-case": "error",
      "guard-for-in": "error",
      "no-magic-numbers": ["error", { 
        "ignore": [-1, 0, 1, 2, 100, 200, 201, 400, 401, 403, 404, 500],
        "ignoreArrayIndexes": true,
        "ignoreDefaultValues": true
      }],
      "no-multi-spaces": "error",
      "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1 }],
      "no-trailing-spaces": "error",
      "space-infix-ops": "error",
      "keyword-spacing": "error",
      "comma-spacing": ["error", { "before": false, "after": true }],

      // Security
      "no-new-wrappers": "error",
      "no-caller": "error",
      "no-extend-native": "error",
      "no-global-assign": "error",
      "no-implicit-globals": "error"
    }
  },
  {
    files: ["**/*.js"],
    rules: {
      // JavaScript specific rules
    }
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "uploads/",
      "*.min.js"
    ]
  }
];
