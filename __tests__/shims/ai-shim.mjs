// Test-context compatibility shim for the 'ai' package.
//
// Why this shim exists:
//   app/api/chat/route.ts does `import { ..., UIMessage } from "ai"`.
//   `UIMessage` is a TypeScript type-only export — it has no runtime value
//   in the 'ai' ESM build. Node.js --experimental-strip-types converts
//   inline `import { type X }` to plain `import { X }`, then throws
//   "does not provide an export named 'UIMessage'" at module instantiation.
//
//   We cannot use `export * from "ai"` here because the loader intercepts
//   all bare 'ai' specifiers and redirects to THIS file — creating a circular
//   import. Instead, we import from the resolved absolute file path.
//
// BUG reference: BUG-001 in bugs.md — developer should use
//   `import type { UIMessage } from "ai"` to avoid this in production tests.

import * as aiPkg from "../../node_modules/ai/dist/index.js";

// Re-export the full ai namespace
export const {
  streamText,
  streamObject,
  generateText,
  generateObject,
  convertToModelMessages,
  convertFileListToFileUIParts,
  UIMessageStreamError,
  UI_MESSAGE_STREAM_HEADERS,
} = aiPkg;

// Also export any other symbols the package provides
export * from "../../node_modules/ai/dist/index.js";

// Type-only placeholder — UIMessage is never used as a runtime value.
// This satisfies the ESM named-binding check without any runtime effect.
export const UIMessage = undefined;
