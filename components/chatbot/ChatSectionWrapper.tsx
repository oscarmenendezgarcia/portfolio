"use client";

import dynamic from "next/dynamic";

const ChatSection = dynamic(() => import("./ChatSection"), { ssr: false });

export default function ChatSectionWrapper() {
  return <ChatSection />;
}
