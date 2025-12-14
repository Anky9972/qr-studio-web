import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rule overrides
  {
    rules: {
      // Disable unescaped entities - too noisy for quotes/apostrophes
      "react/no-unescaped-entities": "off",
      // Downgrade any type to warning - will fix gradually
      "@typescript-eslint/no-explicit-any": "warn",
      // Downgrade unused vars to warning  
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow img elements (next/image not always needed)
      "@next/next/no-img-element": "warn",
      // Allow require imports for dynamic imports
      "@typescript-eslint/no-require-imports": "off",
      // Disable experimental react-hooks rules that produce false positives
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      // Allow empty interfaces/object types
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
]);

export default eslintConfig;

