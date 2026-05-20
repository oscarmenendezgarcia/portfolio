"use client";

import ChatInline from "./ChatInline";

export default function ChatSection() {
  return (
    <section
      id="assistant"
      aria-labelledby="assistant-heading"
      className="py-12"
    >
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        {/* Section heading — same typographic scale as Work / Writing */}
        <div className="mb-5">
          <h2
            id="assistant-heading"
            className="text-2xl lg:text-4xl font-semibold text-text-primary tracking-tight mb-3"
          >
            Ask me anything.
          </h2>
          <p className="text-base text-text-secondary leading-relaxed max-w-lg">
            I&apos;ve trained an assistant on my work, projects, and writing.
            Ask it anything you&apos;d normally ask in a first call.
          </p>
        </div>

        <ChatInline />
      </div>
    </section>
  );
}
