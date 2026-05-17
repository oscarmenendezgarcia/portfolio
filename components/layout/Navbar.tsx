'use client';

import { useState, useEffect, useCallback } from 'react';
import { site } from '@/lib/site';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
// No icon library dependency — keeps the bundle minimal and the navbar tree-shaken.

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[14px] h-[14px] fill-current">
      <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 stroke-current fill-none" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 stroke-current fill-none" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// Map social label → icon component
function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case 'GitHub':    return <GitHubIcon />;
    case 'LinkedIn':  return <LinkedInIcon />;
    case 'X':         return <XIcon />;
    case 'Email':     return <EmailIcon />;
    default:          return null;
  }
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>('');

  // ── Active section via IntersectionObserver ──────────────────────────────
  useEffect(() => {
    const anchorLinks = site.nav.filter((l) => l.href.startsWith('#'));
    const sectionIds = anchorLinks.map((l) => l.href.slice(1));
    const visible = new Set<string>();

    const pickActive = () => {
      // Prefer the topmost visible section in site.nav order
      for (const link of anchorLinks) {
        const id = link.href.slice(1);
        if (visible.has(id)) {
          setActiveHref(link.href);
          return;
        }
      }
      setActiveHref('');
    };

    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visible.add(id);
          } else {
            visible.delete(id);
          }
          pickActive();
        },
        // Section is "active" when it occupies the upper half of the viewport
        { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
      );

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Close menu on Escape ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isMenuOpen]);

  // ── Prevent body scroll while menu is open ───────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // ── Shared link class builder ─────────────────────────────────────────────
  const navLinkClass = (href: string, base: string) =>
    `${base} transition-colors duration-150 ${
      activeHref === href ? 'text-accent' : ''
    }`;

  return (
    <>
      {/* ── Main nav bar content ─────────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="flex items-center justify-between h-full max-w-[900px] mx-auto px-4 md:px-8 lg:px-10"
      >
        {/* Logo */}
        <a
          href="#"
          aria-label={`${site.name} — back to top`}
          className="text-text-primary font-semibold text-sm tracking-widest uppercase hover:text-accent transition-colors duration-150 shrink-0"
          onClick={closeMenu}
        >
          OM
        </a>

        {/* ── Desktop: nav links (center) ───────────────────────────── */}
        <ul
          className="hidden md:flex items-center gap-8 list-none m-0 p-0"
          role="list"
        >
          {site.nav.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={activeHref === link.href ? 'location' : undefined}
                className={navLinkClass(
                  link.href,
                  'text-sm text-text-secondary hover:text-text-primary',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Desktop: CV + social icons (right) ───────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {/* CV download button */}
          <a
            href={site.cvPath}
            download
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/50 rounded-[4px] px-3 py-1.5 hover:bg-accent hover:text-bg transition-colors duration-150"
          >
            <DownloadIcon />
            <span>CV</span>
          </a>

          {/* Social icons */}
          <div
            className="flex items-center gap-3 pl-1 border-l border-border"
            role="list"
          >
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={
                  social.href.startsWith('http')
                    ? 'noopener noreferrer'
                    : undefined
                }
                aria-label={social.label}
                role="listitem"
                className="text-text-secondary hover:text-accent transition-colors duration-150"
              >
                <SocialIcon label={social.label} />
              </a>
            ))}
          </div>
        </div>

        {/* ── Mobile: hamburger toggle ──────────────────────────────── */}
        <button
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden flex items-center justify-center w-10 h-10 -mr-2 text-text-secondary hover:text-text-primary transition-colors duration-150"
        >
          {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </nav>

      {/* ── Mobile menu panel ────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
          className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-bg border-t border-border overflow-y-auto"
        >
          {/* Transparent backdrop — click closes menu */}
          <div
            className="fixed inset-0 top-16"
            aria-hidden="true"
            onClick={closeMenu}
          />

          {/* Menu content */}
          <div className="relative z-10 flex flex-col px-6 py-8 gap-1">
            {/* Section nav links */}
            {site.nav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={activeHref === link.href ? 'location' : undefined}
                onClick={closeMenu}
                className={navLinkClass(
                  link.href,
                  'block text-lg font-normal text-text-primary hover:text-accent py-3 border-b border-border/40',
                )}
              >
                {link.label}
              </a>
            ))}

            {/* CV download — full-width accent button */}
            <a
              href={site.cvPath}
              download
              onClick={closeMenu}
              className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-bg bg-accent rounded-[4px] px-4 py-3 hover:bg-accent-hover transition-colors duration-150"
            >
              <DownloadIcon />
              Download CV
            </a>

            {/* Social links — labeled for mobile readability */}
            <div className="flex flex-col gap-3 mt-6" role="list">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    social.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  onClick={closeMenu}
                  role="listitem"
                  className="inline-flex items-center gap-3 text-sm text-text-secondary hover:text-accent transition-colors duration-150"
                >
                  <SocialIcon label={social.label} />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
