import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-6 mt-4">
      <div className="max-w-[900px] mx-auto px-6 lg:px-10">
        <p className="text-[11px] font-mono text-text-secondary/40 text-center tracking-wide uppercase">
          &copy; {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
