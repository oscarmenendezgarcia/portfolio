// Custom Node.js module resolver for tests.
// Handles:
//   1. The `@/` path alias that Next.js / tsconfig define, mapping it
//      to the project root — e.g. `@/lib/chatbot/config` → `<root>/lib/chatbot/config`.
//   2. Next.js subpath imports (e.g. `next/server`) that need CJS resolution
//      because Node.js ESM doesn't honour the `next` package exports map
//      correctly when used with `--experimental-strip-types`.

import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Loader lives in __tests__/ — project root is one level up
const PROJECT_ROOT = path.resolve(__dirname, "..");

// CJS require used only for module resolution (not loading) of Next.js subpaths
const cjsRequire = createRequire(pathToFileURL(path.join(PROJECT_ROOT, "package.json")).href);

export function resolve(specifier, context, nextResolve) {
  // ── 1. @/ alias → project root ──────────────────────────────────────────
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

  // ── 2. 'ai' package → shim that adds UIMessage placeholder ─────────────
  // route.ts does `import { ..., UIMessage } from "ai"`. UIMessage is type-only
  // and has no runtime value in the 'ai' package, causing ERR_MODULE_NOT_FOUND
  // in Node.js ESM when --experimental-strip-types is active.
  // The shim re-exports everything from 'ai' and adds UIMessage = undefined.
  if (specifier === "ai") {
    const shimPath = path.join(PROJECT_ROOT, "__tests__/shims/ai-shim.mjs");
    return nextResolve(pathToFileURL(shimPath).href, context);
  }

  // ── 3. next/* subpath imports → resolve via CJS exports map ─────────────
  // `--experimental-strip-types` converts `import { type X } from "next/server"`
  // into `import { X } from "next/server"`. The ESM resolver in this context
  // doesn't honour the `next` package.json `exports` field for subpaths, so
  // we use CJS `require.resolve()` (which does honour exports) to find the
  // actual file path, then forward it to the ESM loader.
  if (specifier.startsWith("next/") && !specifier.startsWith("next/dist/")) {
    try {
      const resolved = cjsRequire.resolve(specifier);
      return nextResolve(pathToFileURL(resolved).href, context);
    } catch {
      // Fall through to default resolution
    }
  }

  return nextResolve(specifier, context);
}
