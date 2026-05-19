import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Writing from "@/components/sections/Writing";
import Philosophy from "@/components/sections/Philosophy";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import ChatSectionWrapper from "@/components/chatbot/ChatSectionWrapper";

export default function Home() {
  return (
    <>
      <Hero />
      <ChatSectionWrapper />
      <Work />
      <Writing />
      <Philosophy />
      <Contact />
      <Footer />
    </>
  );
}
