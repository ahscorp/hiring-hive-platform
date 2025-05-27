import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".vite/"] },

  // Base JavaScript recommended config
  // Applies to .js files by default through ESLint's internal logic,
  // or more broadly if not overridden by more specific configs.
  js.configs.recommended,

  // TypeScript recommended configurations
  // These apply to .ts and .tsx files as they have internal 'files' specifications.
  // They also set up the TypeScript parser and essential parserOptions.
  ...tseslint.configs.recommended,

  // Custom configuration for TypeScript and React (.ts, .tsx) files
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      globals: globals.browser, // Ensure browser globals are available
      parserOptions: {
        ecmaVersion: 2020, // From original config
        ecmaFeatures: { jsx: true }, // Enable JSX parsing for React
        // For type-aware linting (optional, but recommended for full TS power):
        // project: true,
        // tsconfigRootDir: import.meta.dirname, // Or specify path to tsconfig.json
      },
    },
    rules: {
      // Rules from eslint-plugin-react-hooks
      ...reactHooks.configs.recommended.rules,

      // Custom project-specific rules
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off", // From original config

      // Example of enabling a specific jsx-a11y rule:
      // "jsx-a11y/anchor-has-content": "warn", // This was one of the original errors
      // Add other jsx-a11y rules as needed.
    },
  }
);
