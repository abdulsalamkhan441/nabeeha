"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionValue,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  RotateCw,
} from "lucide-react";
import { Glow, Rings, Watermark, displayFont } from "./ui";

/* ------------------------------------------------------------------ */
/* CONTENT                                                            */
/* ------------------------------------------------------------------ */
type Project = {
  id: string;
  title: string;
  category: string;
  description: string; // one or two lines, shown under the carousel
  challenge: string; // back of the card: what was hard
  solution: string; // back of the card: how it was solved
  outcome?: string; // optional: what changed or what she learned
  stack: string[]; // what was used
  image?: string; // local image in /public
  href?: string; // live site
  repo?: string; // GitHub
};

const PROJECTS: Project[] = [
  {
    id: "portfolio",
    title: "This portfolio",
    category: "Front-end",
    description:
      "A scroll-driven personal site: her story, skills and work in one continuous experience.",
    challenge:
      "Keeping a long, pinned, scroll-driven story smooth on every screen size, and still comfortable for people who prefer less motion.",
    solution:
      "One scroll value drives each chapter inside a single pinned stage. Phones and tablets get a separate stacked layout, and every animation has a calm fallback when reduced motion is on.",
    outcome: "One page that reads as a story instead of a list of sections.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    image: "/pro4.jpg",
  },
  {
    id: "project-2",
    title: "Dashboard app",
    category: "Full-stack",
    description: "Placeholder: describe what it does and what Nabeeha built.",
    challenge: "Placeholder: what was the hardest problem in this project?",
    solution: "Placeholder: how did she solve it, and why that approach?",
    stack: ["React", "Node.js"],
    image: "/pro2.jpg",
  },
  {
    id: "project-3",
    title: "Landing page",
    category: "Front-end",
    description: "Placeholder: describe what it does and what Nabeeha built.",
    challenge: "Placeholder: what was the hardest problem in this project?",
    solution: "Placeholder: how did she solve it, and why that approach?",
    stack: ["Next.js", "Tailwind CSS"],
    image: "/pro5.jpg",
  },
  {
    id: "project-4",
    title: "Web app",
    category: "Full-stack",
    description: "Placeholder: describe what it does and what Nabeeha built.",
    challenge: "Placeholder: what was the hardest problem in this project?",
    solution: "Placeholder: how did she solve it, and why that approach?",
    stack: ["React", "REST APIs"],
    image: "/pro1.jpg",
  },
  {
    id: "project-5",
    title: "API service",
    category: "Back-end",
    description: "Placeholder: describe what it does and what Nabeeha built.",
    challenge: "Placeholder: what was the hardest problem in this project?",
    solution: "Placeholder: how did she solve it, and why that approach?",
    stack: ["Node.js", "Databases"],
    image: "/pro3.jpg",
  },
];

const INTRO = {
  small: "If you need",
  big: "a developer for",
  words: [
    "portfolio sites",
    "landing pages",
    "dashboards",
    "web apps",
    "full-stack products",
  ],
};

/* ------------------------------------------------------------------ */
/* AUTO-PLAYING WORD LIST                                             */
/* ------------------------------------------------------------------ */
const ROW = 4; // rem, height of one word row
const N = INTRO.words.length;
const COPIES = [...INTRO.words, ...INTRO.words, ...INTRO.words];
const TICK_MS = 1200; // new word every 1.2s, always running
const SLIDE_S = 0.5;

function Word({
  text,
  index,
  pos,
}: {
  text: string;
  index: number;
  pos: MotionValue<number>;
}) {
  const hi = useTransform(pos, (v) => Math.max(0, 1 - Math.abs(v - index) * 1.6));
  const base = useTransform(pos, (v) => {
    const d = Math.abs(v - index);
    const dim = Math.max(0.12, 0.55 - d * 0.2);
    return dim * (1 - Math.max(0, 1 - d * 1.6));
  });
  const scale = useTransform(pos, (v) => 1 - Math.min(Math.abs(v - index), 2) * 0.04);

  const cls = "text-4xl sm:text-5xl lg:text-6xl whitespace-nowrap leading-none";
  return (
    <li className="relative flex items-center" style={{ height: `${ROW}rem` }}>
      <motion.span
        style={{ opacity: base, scale, ...displayFont }}
        className={`origin-left text-[var(--light-200)] ${cls}`}
      >
        {text}
      </motion.span>
      <motion.span
        aria-hidden="true"
        style={{ opacity: hi, scale, ...displayFont }}
        className={`text-sheen absolute left-0 origin-left ${cls}`}
      >
        {text}
      </motion.span>
    </li>
  );
}

function IntroHeader() {
  const reduce = useReducedMotion();
  const pos = useMotionValue(N);
  const target = useRef(N);
  const listY = useTransform(pos, (v) => `${-v * ROW}rem`);

  useEffect(() => {
    if (reduce) return; // only the OS-level "reduce motion" setting stops it
    const id = setInterval(() => {
      target.current += 1;
      animate(pos, target.current, {
        duration: SLIDE_S,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          if (target.current >= 2 * N) {
            target.current = N;
            pos.set(N);
          }
        },
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [reduce, pos]);

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-4 px-6 pb-12 pt-28 text-center md:flex-row md:gap-14 md:pb-16 md:pt-32 md:text-left"
    >
      <Watermark className="left-1/2 top-12 -translate-x-1/2 text-[30vw] md:top-8 md:text-[20vw]">
        Work
      </Watermark>
      <Glow className="left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 sm:h-[560px] sm:w-[560px]" strength={0.22} />

      <div className="relative space-y-2">
        <h2 id="projects-title" className="flex flex-col gap-2">
          <span className="text-base font-normal text-[var(--light-400)] sm:text-lg">
            {INTRO.small}
          </span>
          <span
            className="text-5xl leading-[1.1] text-[var(--text-white)] sm:text-6xl lg:text-7xl"
            style={displayFont}
          >
            {INTRO.big}
          </span>
        </h2>
      </div>

      {reduce ? (
        <ul className="relative space-y-2">
          {INTRO.words.map((w) => (
            <li
              key={w}
              className="text-sheen text-4xl leading-tight sm:text-5xl"
              style={displayFont}
            >
              {w}
            </li>
          ))}
        </ul>
      ) : (
        <div className="relative max-w-full">
          <ul className="sr-only">
            {INTRO.words.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <div
            aria-hidden="true"
            className="relative overflow-hidden"
            style={{
              height: `${ROW * 3}rem`,
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            }}
          >
            <motion.ul style={{ y: listY, paddingTop: `${ROW}rem` }}>
              {COPIES.map((w, k) => (
                <Word key={k} text={w} index={k} pos={pos} />
              ))}
            </motion.ul>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CARD ART                                                           */
/* ------------------------------------------------------------------ */
function CardArt({ project, eager }: { project: Project; eager: boolean }) {
  return (
    <div className="absolute inset-0">
      {project.image ? (
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 300px, 400px"
          quality={90}
          priority={eager}
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--dark-300)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.35)] to-transparent opacity-90" />
    </div>
  );
}

const backface = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
} as React.CSSProperties;

function StoryBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold text-[var(--fb-300)]">{label}</p>
      <p className="text-[13.5px] leading-relaxed text-[var(--light-300)]">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CAROUSEL                                                           */
/* ------------------------------------------------------------------ */
function Carousel() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(2);
  const [flipped, setFlipped] = useState(false);
  const [cw, setCw] = useState(290);
  const last = PROJECTS.length - 1;

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      setCw(w < 400 ? 260 : w < 640 ? 290 : w < 1100 ? 340 : 380);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const ch = Math.round(cw * 1.45);
  const spacing = cw * 0.78;

  const go = (i: number) => {
    setFlipped(false);
    setIndex(Math.min(last, Math.max(0, i)));
  };
  const active = PROJECTS[index];

  return (
    <div className="relative mx-auto w-full max-w-[1100px] px-4 pb-24 sm:px-6 sm:pb-32">
      <p className="mx-auto max-w-md text-center text-sm text-[var(--light-400)]">
        Pick a card, then open its case study to see the challenge and how it was solved.
      </p>

      {/* Stage */}
      <motion.div
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected projects"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
          if (e.key === "Escape") setFlipped(false);
        }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -50) go(index + 1);
          else if (info.offset.x > 50) go(index - 1);
        }}
        className="relative mx-auto mt-8 overflow-hidden rounded-3xl sm:mt-10"
        style={{ height: ch + 48, perspective: 1800, touchAction: "pan-y" }}
      >
        <Glow className="left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2" strength={0.28} />
        {PROJECTS.map((p, i) => {
          const o = i - index;
          const abs = Math.abs(o);
          const isActive = abs === 0;
          const showBack = isActive && flipped;
          return (
            <motion.div
              key={p.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${PROJECTS.length}: ${p.title}`}
              initial={false}
              animate={{
                x: o * spacing,
                y: isActive ? 24 : 24 - abs * 14,
                scale: isActive ? 1 : Math.max(0.7, 0.88 - (abs - 1) * 0.08),
                rotateY: -o * 18,
                opacity: abs > 2 ? 0 : 1 - abs * 0.18,
              }}
              transition={
                reduce ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 24 }
              }
              style={{
                width: cw,
                height: ch,
                marginLeft: -cw / 2,
                zIndex: 10 - abs,
                pointerEvents: abs > 2 ? "none" : "auto",
                transformStyle: "preserve-3d",
              }}
              className="absolute left-1/2 top-0"
            >
              {/* The flipping container */}
              <motion.div
                animate={{ rotateY: showBack ? 180 : 0 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
                }
                style={{ transformStyle: "preserve-3d" }}
                className="relative h-full w-full"
              >
                {/* FRONT */}
                <div
                  style={backface}
                  aria-hidden={showBack}
                  className="absolute inset-0 overflow-hidden rounded-[1.75rem] border border-[var(--glass-border)] shadow-2xl shadow-black"
                >
                  <CardArt project={p} eager={i === 2} />

                  {isActive && (
                    <span className="glass absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-xs text-[var(--text-white)]">
                      {p.category}
                    </span>
                  )}

                  <div className="absolute inset-x-4 bottom-4 z-10 flex flex-col items-center gap-2.5">
                    <span
                      className={`text-center font-semibold text-[var(--text-white)] ${
                        isActive ? "text-xl" : "text-sm text-[var(--light-300)]"
                      }`}
                    >
                      {p.title}
                    </span>
                    {isActive && (
                      <button
                        type="button"
                        onClick={() => setFlipped(true)}
                        tabIndex={showBack ? -1 : 0}
                        className="btn-ghost !gap-1.5 !px-4 !py-2 !text-xs"
                      >
                        <RotateCw size={13} aria-hidden="true" />
                        Case study
                      </button>
                    )}
                  </div>

                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`Show ${p.title}`}
                      className="absolute inset-0 z-20"
                    />
                  )}
                </div>

                {/* BACK: the case study */}
                <div
                  style={{ ...backface, transform: "rotateY(180deg)" }}
                  aria-hidden={!showBack}
                  className="glass-flat absolute inset-0 overflow-hidden rounded-[1.75rem] !border-[var(--fb-400)] shadow-2xl shadow-black"
                >
                  <div className="flex h-full flex-col gap-4 overflow-y-auto p-5 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] text-[var(--light-500)]">{p.category}</p>
                        <p
                          className="text-2xl leading-tight text-[var(--text-white)]"
                          style={displayFont}
                        >
                          {p.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFlipped(false)}
                        tabIndex={showBack ? 0 : -1}
                        aria-label="Back to card"
                        className="icon-btn h-8 w-8 shrink-0"
                      >
                        <RotateCw size={14} aria-hidden="true" />
                      </button>
                    </div>

                    <StoryBlock label="The challenge">{p.challenge}</StoryBlock>
                    <StoryBlock label="How it was solved">{p.solution}</StoryBlock>
                    {p.outcome && <StoryBlock label="The result">{p.outcome}</StoryBlock>}

                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold text-[var(--fb-300)]">
                        What was used
                      </p>
                      <ul className="flex flex-wrap gap-1.5">
                        {p.stack.map((t) => (
                          <li key={t} className="chip !px-2.5 !py-0.5 !text-[11px]">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Details of the active project */}
      <div className="mx-auto mt-6 min-h-[5.5rem] max-w-xl text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <p className="leading-relaxed text-[var(--light-300)]">
              {active.description}
            </p>
            {(active.href || active.repo) && (
              <div className="flex flex-wrap justify-center gap-3">
                {active.href && (
                  <a
                    href={active.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    View project <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
                {active.repo && (
                  <a
                    href={active.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    View code
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows and position */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="Previous project"
          className="icon-btn h-12 w-14"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <span className="min-w-[3.5rem] text-center text-sm text-[var(--light-400)]" aria-hidden="true">
          {index + 1} / {PROJECTS.length}
        </span>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === last}
          aria-label="Next project"
          className="icon-btn h-12 w-14"
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
export default function ProjectsShowcase() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative overflow-hidden text-[var(--text-white)]"
    >
      <Rings className="absolute left-1/2 top-[18%] h-[900px] w-[900px] max-w-none -translate-x-1/2" rings={5} />
      <div className="hairline absolute inset-x-0 top-0" />
      <IntroHeader />
      <Carousel />
    </section>
  );
}