"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Monogram, displayFont } from "./ui";
import { anchorTop, findTarget, scrollToId } from "./scroll";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  /* Which section is in view. Uses the same anchors as the footer, so it also
     works with the pinned desktop story where About and Skills share a screen. */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
      const mark = window.scrollY + window.innerHeight * 0.4;
      let current = LINKS[0].id;
      for (const l of LINKS) {
        const el = findTarget(l.id);
        if (el && anchorTop(el) <= mark) current = l.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id, reduce);
  };

  return (
    <motion.header
      initial={reduce ? false : { y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <div className="relative mx-auto max-w-[1200px]">
        <div
          className={`glass flex items-center justify-between rounded-full px-3 py-2 transition-shadow duration-500 sm:px-4 ${
            scrolled ? "shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)]" : ""
          }`}
        >
          <a
            href="#home"
            onClick={(e) => go(e, "home")}
            aria-label="Nabeeha Maqsood, back to top"
            className="flex items-center gap-2.5 rounded-full pr-3"
          >
            <Monogram size={36} />
            <span className="text-2xl leading-none text-[var(--rd-100)]" style={displayFont}>
              Nabeeha
            </span>
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((l) => {
                const on = active === l.id;
                return (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      onClick={(e) => go(e, l.id)}
                      aria-current={on ? "true" : undefined}
                      className={`relative block rounded-full px-3.5 py-2 text-sm transition-colors duration-300 ${
                        on ? "text-white" : "text-[var(--light-400)] hover:text-white"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="nav-pill"
                          aria-hidden="true"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-full border border-[var(--glass-border)] bg-[rgba(173,125,86,0.22)]"
                        />
                      )}
                      <span className="relative">{l.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => go(e, "contact")}
              className="btn-primary hidden !px-5 !py-2.5 lg:inline-flex"
            >
              Let&apos;s talk
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="icon-btn h-10 w-10 md:hidden"
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={reduce ? false : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="glass absolute inset-x-0 top-full mt-2 origin-top rounded-3xl p-3 md:hidden"
            >
              <ul className="space-y-1">
                {LINKS.map((l) => (
                  <li key={l.id}>
                    <a
                      href={`#${l.id}`}
                      onClick={(e) => go(e, l.id)}
                      aria-current={active === l.id ? "true" : undefined}
                      className={`block rounded-2xl px-4 py-3 text-base transition-colors ${
                        active === l.id
                          ? "bg-[rgba(173,125,86,0.22)] text-white"
                          : "text-[var(--light-300)] hover:bg-[var(--glass-fill)]"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={(e) => go(e, "contact")}
                className="btn-primary mt-3 w-full"
              >
                Let&apos;s talk
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}