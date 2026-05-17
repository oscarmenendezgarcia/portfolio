"use client";

// Client-component wrapper that lazy-loads the full Chatbot bundle.
// `ssr: false` must live inside a Client Component — Server Components
// do not support it directly in Next.js App Router.

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("./Chatbot"), { ssr: false });

export default function ChatbotWrapper() {
  return <Chatbot />;
}
