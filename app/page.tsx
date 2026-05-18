// Root page — Server Component.
// Composes all portfolio sections in order; no client-side JS required.
// ChatbotWrapper is a client component that lazy-loads the chatbot bundle
// (ssr: false) so the homepage static payload is unaffected.
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Writing from "@/components/sections/Writing";
import Philosophy from "@/components/sections/Philosophy";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import ChatbotWrapper from "@/components/chatbot/ChatbotWrapper";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Writing />
      <Philosophy />
      <Contact />
      <Footer />
      <ChatbotWrapper />
    </>
  );
}
