"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Mail } from "lucide-react";
import { Glow, Monogram, displayFont } from "./ui";
import { scrollToId } from "./scroll";

/* ------------------------------------------------------------------ */
/* CUSTOM SOCIAL SVG COMPONENTS (no extra icon packages needed)        */
/* ------------------------------------------------------------------ */
function GithubIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CONTENT                                                            */
/* ------------------------------------------------------------------ */
const SITE = {
  name: "Nabeeha Maqsood",
  wordmark: "Nabeeha",
  place: "Karachi, Pakistan",
  timeZone: "Asia/Karachi",
  email: "hello@yourdomain.com",
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
};

const COLUMNS: {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Projects", href: "#projects" },
      { label: "Process", href: "#process" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Work together",
    links: [
      { label: "Start a project", href: "#contact" },
      { label: "See the process", href: "#process" },
      { label: "Browse projects", href: "#projects" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Email", href: `mailto:${SITE.email}` },
      { label: "LinkedIn", href: SITE.linkedin, external: true },
      { label: "GitHub", href: SITE.github, external: true },
    ],
  },
];

const SOCIALS: {
  label: string;
  href: string;
  icon: React.FC<{ size?: number; className?: string }>;
  external?: boolean;
}[] = [
  { label: "Email", href: `mailto:${SITE.email}`, icon: Mail },
  { label: "LinkedIn", href: SITE.linkedin, icon: LinkedinIcon, external: true },
  { label: "GitHub", href: SITE.github, icon: GithubIcon, external: true },
];

/* ------------------------------------------------------------------ */
/* WORDMARK: large script name that fades into the page. A soft light  */
/* follows the pointer through CSS variables (no animation loop).      */
/* ------------------------------------------------------------------ */
function Wordmark() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div
      ref={ref}
      role="img"
      aria-label={SITE.name}
      onPointerMove={onMove}
      className="footer-wordmark"
    >
      {SITE.wordmark}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN                                                               */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const reduce = useReducedMotion() ?? false;
  const [time, setTime] = useState("");
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: SITE.timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const jump = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith("#")) return;
    if (scrollToId(href.slice(1), reduce)) e.preventDefault();
  };

  const linkCls =
    "inline-block text-sm text-[var(--light-400)] transition-colors hover:text-[var(--text-white)]";

  return (
    <footer className="relative overflow-hidden pt-16 text-[var(--text-white)] sm:pt-24">
      <div className="hairline absolute inset-x-0 top-0" />
      <Glow className="left-1/2 top-[30%] h-[640px] w-[900px] max-w-none -translate-x-1/2" strength={0.22} />

      {/* Big name, fading into the page */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-[1300px] px-4"
      >
        <Wordmark />
      </motion.div>

      {/* Glass panel overlaps the bottom of the name, so the name blurs behind it */}
      <div className="relative z-10 mx-auto -mt-10 max-w-[1200px] px-4 pb-6 sm:-mt-20 sm:px-6">
        <div className="glass rounded-[2rem] p-6 sm:p-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-x-10">
            <div className="col-span-2 space-y-5 md:col-span-1">
              <a
                href="#home"
                onClick={(e) => jump(e, "#home")}
                className="inline-flex items-center gap-3 rounded-full"
              >
                <Monogram size={44} />
                <span className="text-3xl leading-none text-[var(--rd-100)]" style={displayFont}>
                  {SITE.wordmark}
                </span>
              </a>

              <p className="max-w-xs text-sm leading-relaxed text-[var(--light-400)]">
                Front-end developer who ships the whole stack.
                <br />
                {SITE.place}
              </p>

              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-fill)] px-3 py-1.5 text-xs text-[var(--light-200)]">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--fb-400)] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--fb-400)]" />
                </span>
                {time ? `${time} in Karachi` : "Karachi, PKT"}
              </p>

              <ul className="flex gap-3 pt-1">
                {SOCIALS.map(({ label, href, icon: Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="icon-btn h-10 w-10"
                    >
                      <Icon size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {COLUMNS.map((col, i) => (
              <nav
                key={col.title}
                aria-label={col.title}
                className={`space-y-4 ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <p className="text-sm font-semibold text-[var(--rd-300)]">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        onClick={(e) => jump(e, l.href)}
                        {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={linkCls}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="hairline my-8" />

          <div className="flex flex-col items-start justify-between gap-4 text-xs text-[var(--light-500)] sm:flex-row sm:items-center">
            <p>
              &copy; {currentYear} {SITE.name}. Built with Next.js, TypeScript, Tailwind CSS and
              Framer Motion.
            </p>
            <button
              type="button"
              onClick={() => {
                const lenis = (window as unknown as {
                  __lenis?: { scrollTo: (t: number, o?: Record<string, unknown>) => void };
                }).__lenis;
                if (lenis && !reduce) lenis.scrollTo(0, { duration: 1.6 });
                else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
              }}
              className="btn-ghost !px-4 !py-2 !text-xs !font-normal"
            >
              Back to top
              <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}