// Server Component
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8 mt-20">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <p className="text-text-secondary text-sm text-center">
          &copy; {year} {site.name}. Made with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover transition-colors"
          >
            Next.js
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
