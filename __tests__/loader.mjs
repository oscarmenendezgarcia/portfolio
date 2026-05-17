// Custom Node.js module resolver for tests.
// Handles the `@/` path alias that Next.js / tsconfig define, mapping it
// to the project root — e.g. `@/lib/chatbot/config` → `<root>/lib/chatbot/config`.

import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Loader lives in __tests__/ — project root is one level up
const PROJECT_ROOT = path.resolve(__dirname, "..");

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const relative = specifier.slice(2); // strip "@/"
    const absolute = path.join(PROJECT_ROOT, relative);
    // Try .ts extension first, then fall back
    for (const ext of [".ts", ".tsx", ".js", ""]) {
      try {
        const url = pathToFileURL(absolute + ext).href;
        return nextResolve(url, context);
      } catch {
        // Try next extension
      }
    }
  }
  return nextResolve(specifier, context);
}
