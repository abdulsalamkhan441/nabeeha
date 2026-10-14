"use client";

import React, { useId, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  AnimatePresence,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Binary,
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  GitBranch,
  GraduationCap,
  Layers,
  MapPin,
  Server,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Glow, Monogram, Rings, Watermark, displayFont } from "./ui";

/* ------------------------------------------------------------------ */
/* CONTENT: edit everything about her in one place                     */
/* ------------------------------------------------------------------ */
type Segment = string | { term: string; blurb: string };

const CONTENT = {
  name: "Nabeeha Maqsood",
  role: "Front-end developer who ships the whole stack",
  intro:
    "Computer science graduate from Karachi, building fast, accessible interfaces and the back-end that powers them.",
  portrait: "/final.png", // put her photo in /public (4:5 works best)
  initials: "NM",
  origin: {
    label: "Roots & education",
    title: "Karachi-built, FAST-trained",
    body: [
      "Nabeeha is based in ",
      {
        term: "Karachi",
        blurb:
          "Pakistan's largest city, on the Arabian Sea, and a major hub for the country's tech scene.",
      },
      " and earned her BS in Computer Science from ",
      {
        term: "FAST-NUCES",
        blurb:
          "The National University of Computer and Emerging Sciences, one of Pakistan's leading computing universities.",
      },
      " in 2025. Strong fundamentals in data structures, systems and problem-solving sit underneath every interface she builds.",
    ] as Segment[],
    quote: "Do it well, do it honestly, and do it with care.",
  },
  craft: {
    label: "Craft & practice",
    title: "Interfaces with substance behind them",
    body: [
      "She builds with ",
      {
        term: "Next.js",
        blurb:
          "A React framework for production web apps: fast to load, easy to find on search, and simple to scale.",
      },
      ", TypeScript and Tailwind CSS, adds motion with ",
      {
        term: "Framer Motion",
        blurb:
          "An animation library for React. Used sparingly, it explains what changed on screen instead of just decorating it.",
      },
      ", and connects it all to real back-ends, so a design doesn't just look right: it works end to end.",
    ] as Segment[],
    chips: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "REST APIs"],
  },
  skillsLabel: "What she works with",
  skillsTitle: "The toolkit behind the interfaces",
};

const CREDENTIALS: { icon: LucideIcon; text: string }[] = [
  { icon: GraduationCap, text: "BS Computer Science, FAST-NUCES" },
  { icon: MapPin, text: "Karachi, Pakistan" },
  { icon: Code2, text: "Next.js, TypeScript, Node.js" },
];

/* Each card says what she does with the skill (no made-up percentages). */
type Skill = {
  id: string;
  title: string;
  line: string;
  detail: string;
  tools: string[];
  icon: LucideIcon;
};

const SKILLS: Skill[] = [
  {
    id: "frontend",
    title: "Front-end",
    line: "Fast, responsive interfaces",
    detail:
      "Component-driven UIs that load quickly, adapt to every screen size and stay easy to maintain as they grow.",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    icon: Layers,
  },
  {
    id: "motion",
    title: "Motion",
    line: "Animation with a purpose",
    detail:
      "Transitions and scroll effects that explain what changed on screen, and step aside for people who prefer reduced motion.",
    tools: ["Framer Motion", "CSS animation", "Scroll effects"],
    icon: Sparkles,
  },
  {
    id: "backend",
    title: "Back-end",
    line: "APIs that hold up",
    detail:
      "Server logic and APIs that connect an interface to real data, so a design works end to end.",
    tools: ["Node.js", "REST APIs"],
    icon: Server,
  },
  {
    id: "data",
    title: "Data",
    line: "Storing it sensibly",
    detail:
      "Designing and querying databases so the data behind an app stays organised and quick to reach.",
    tools: ["SQL", "NoSQL", "Data modelling"],
    icon: Database,
  },
  {
    id: "foundations",
    title: "Foundations",
    line: "A CS degree underneath",
    detail:
      "Data structures, algorithms and object-oriented design from her BS in Computer Science at FAST-NUCES.",
    tools: ["Data structures", "Algorithms", "OOP"],
    icon: Binary,
  },
  {
    id: "workflow",
    title: "Workflow",
    line: "Clean, shareable code",
    detail:
      "Version control and review habits that keep a team's work tidy, traceable and easy to hand over.",
    tools: ["Git", "GitHub", "Code review"],
    icon: GitBranch,
  },
];

/* Ring geometry (px). Front cards sit low and overlap her; back cards sit
   higher and dimmer behind her. */
const RX = 380;
const LIFT = 44;
const BASE_Y = 140;
const STEP = 360 / SKILLS.length;
const mod = (n: number, m: number) => ((n % m) + m) % m;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* REVEAL TITLE                                                        */
/* Words rise out of a mask. Letters are NOT split, so the script font */
/* keeps its natural joins and kerning.                                */
/* ------------------------------------------------------------------ */
const wordsContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const wordItem = {
  hidden: { y: "115%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

function RevealTitle({
  text,
  className = "",
  style,
  as: Tag = "h2",
  active,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  active?: boolean;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const trigger =
    active === undefined
      ? { whileInView: "visible", viewport: { once: true, amount: 0.5 } }
      : { animate: active ? "visible" : "hidden" };

  return (
    <Tag className={className} style={style} aria-label={text}>
      <motion.span
        aria-hidden="true"
        variants={wordsContainer}
        initial="hidden"
        {...trigger}
      >
        {text.split(" ").map((word, i) => (
          <span
            key={i}
            className="-my-[0.15em] inline-block overflow-hidden px-[0.06em] py-[0.15em] align-bottom"
          >
            <motion.span variants={wordItem} className="inline-block">
              {word}
            </motion.span>
            {"\u00A0"}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* GLOSSARY TERM                                                       */
/* ------------------------------------------------------------------ */
function GlossaryTerm({ term, blurb }: { term: string; blurb: string }) {
  const id = useId();
  return (
    <span className="group/glossary relative inline-block">
      <span
        tabIndex={0}
        aria-describedby={id}
        className="cursor-help rounded-sm border-b border-dotted border-[var(--fb-400)] font-medium text-[var(--text-white)]"
      >
        {term}
      </span>
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-3 w-52 -translate-x-1/2 translate-y-1 scale-95 opacity-0 transition-all duration-200 ease-out group-hover/glossary:translate-y-0 group-hover/glossary:scale-100 group-hover/glossary:opacity-100 group-focus-within/glossary:translate-y-0 group-focus-within/glossary:scale-100 group-focus-within/glossary:opacity-100"
      >
        <span className="glass block rounded-xl px-3.5 py-3 text-left text-[12px] font-normal leading-relaxed text-[var(--light-300)]">
          <span className="mb-1 block text-[13px] font-semibold text-[var(--rd-300)]">
            {term}
          </span>
          {blurb}
        </span>
      </span>
    </span>
  );
}

function RichText({
  segments,
  interactive,
}: {
  segments: Segment[];
  interactive: boolean;
}) {
  return (
    <>
      {segments.map((s, i) =>
        typeof s === "string" ? (
          <React.Fragment key={i}>{s}</React.Fragment>
        ) : interactive ? (
          <GlossaryTerm key={i} term={s.term} blurb={s.blurb} />
        ) : (
          <span key={i} className="font-medium text-[var(--text-white)]">
            {s.term}
          </span>
        )
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* SMALL PIECES                                                        */
/* ------------------------------------------------------------------ */

/** Her photo, with a graceful monogram fallback if the image is missing. */
function Portrait({ sizes, priority = false }: { sizes: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--dark-300)]">
        <Monogram size={96} />
      </div>
    );
  }

  return (
    <Image
      src={CONTENT.portrait}
      alt={`Portrait of ${CONTENT.name}`}
      fill
      priority={priority}
      className="object-cover object-top"
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="btn-primary">
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="btn-ghost">
      {children}
    </a>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((c) => (
        <li key={c} className="chip">
          {c}
        </li>
      ))}
    </ul>
  );
}

function Credentials() {
  return (
    <ul className="flex flex-wrap gap-2">
      {CREDENTIALS.map(({ icon: Icon, text }) => (
        <li
          key={text}
          className="glass flex items-center gap-2 rounded-full px-3.5 py-2 text-xs text-[var(--light-200)]"
        >
          <Icon size={14} className="text-[var(--fb-300)]" aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  );
}

function ScrollCue({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-sm text-[var(--light-500)]">
      <span
        aria-hidden="true"
        className="relative block h-px w-12 overflow-hidden bg-[var(--dark-500)]"
      >
        <span className="scroll-line absolute inset-y-0 left-0 w-1/2 bg-[var(--fb-400)]" />
      </span>
      {children}
    </p>
  );
}

function SkillDetail({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[var(--fb-300)]">
        <Icon size={16} aria-hidden="true" />
        <span className="text-sm font-semibold">{skill.title}</span>
      </div>
      <p className="text-sm leading-relaxed text-[var(--light-300)]">{skill.detail}</p>
      <TagList items={skill.tools} />
    </div>
  );
}

const labelClass = "text-sm font-semibold text-[var(--fb-300)]";
const iconTile =
  "flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--rd-300)] to-[var(--fb-500)] text-black";

/* ------------------------------------------------------------------ */
/* RING CARD: position, size and stacking all derive from one           */
/* rotation value. `reveal` (0 to 1) pulls the cards out from behind    */
/* her when the skills chapter begins. Depth uses scale and opacity     */
/* only (no blur filters), which keeps scrolling smooth.                */
/* ------------------------------------------------------------------ */
function RingCard({
  skill,
  index,
  rotation,
  reveal,
  isFront,
  interactive,
  onSelect,
  onStep,
}: {
  skill: Skill;
  index: number;
  rotation: MotionValue<number>;
  reveal: MotionValue<number>;
  isFront: boolean;
  interactive: boolean;
  onSelect: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const rad = (r: number) => ((index * STEP + r) * Math.PI) / 180;
  const sin = useTransform(rotation, (r) => Math.sin(rad(r)));
  const cos = useTransform(rotation, (r) => Math.cos(rad(r)));

  const x = useTransform([sin, reveal], ([s, rv]: number[]) => s * RX * rv);
  const y = useTransform([cos, reveal], ([c, rv]: number[]) => ((c - 1) * LIFT + BASE_Y) * rv);
  const scale = useTransform(
    [cos, reveal],
    ([c, rv]: number[]) => (0.72 + 0.28 * ((c + 1) / 2)) * (0.5 + 0.5 * rv)
  );
  const opacity = useTransform(
    [cos, reveal],
    ([c, rv]: number[]) => (0.3 + 0.7 * ((c + 1) / 2)) * rv
  );
  const zIndex = useTransform(cos, (c) => Math.round(c * 10) + 10);
  const pointerEvents = useTransform(reveal, (rv) => (rv > 0.9 ? "auto" : "none"));

  const Icon = skill.icon;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onStep(1);
        if (e.key === "ArrowLeft") onStep(-1);
      }}
      tabIndex={interactive ? 0 : -1}
      aria-hidden={!interactive}
      aria-pressed={isFront}
      aria-label={`${skill.title}: ${skill.line}`}
      style={{ x, y, scale, opacity, zIndex, pointerEvents, willChange: "transform, opacity" }}
      className={`glass-flat absolute left-1/2 top-1/2 -ml-[105px] -mt-[52px] flex w-[210px] items-center gap-3 rounded-2xl p-3.5 text-left transition-[border-color,box-shadow] duration-300 ${
        isFront
          ? "!border-[var(--fb-400)] shadow-[0_0_34px_rgba(173,125,86,0.3)]"
          : ""
      }`}
    >
      <span className={`h-10 w-10 ${iconTile}`}>
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[var(--text-white)]">
          {skill.title}
        </span>
        <span className="block text-xs leading-snug text-[var(--light-400)]">
          {skill.line}
        </span>
      </span>
    </motion.button>
  );
}

/* Circular text stamp */
function Badge() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-24 w-24" aria-hidden="true">
      <motion.svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id="badge-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <text fontSize="9" letterSpacing="2.2" fill="var(--light-400)">
          <textPath href="#badge-circle">clean code • careful craft • </textPath>
        </text>
      </motion.svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Monogram size={36} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT: one continuous story                                */
/*                                                                     */
/* Desktop (>=1100px), one pinned scroll of 400vh:                     */
/*   1. Hero: her name; the portrait slides in and settles in a frame. */
/*   2. About: two story columns open on either side of her.           */
/*   3. Skills: the columns leave, skill cards swing out from behind   */
/*      her into a ring, and scrolling turns it (click works too).     */
/* Below 1100px: a plain stacked layout, no scroll-jacking.            */
/* No background of its own: the fixed site background shows through.  */
/* ------------------------------------------------------------------ */
export default function AboutHeroSkills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [storyOn, setStoryOn] = useState(false);
  const [ringOn, setRingOn] = useState(false);
  const [front, setFront] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const anim = useRef<ReturnType<typeof animate> | null>(null);

  /* Scroll is already smoothed by Lenis, so we read it directly. Adding a
     spring on top would only make everything trail behind the scrollbar. */
  const { scrollYProgress: p } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(p, "change", (v) => {
    if (v > 0.167) setStoryOn(true);
    setRingOn(v > 0.58);
  });

  /* ---- Chapter 1 and 2: hero to about (first quarter of the scroll) ---- */
  const frameX = useTransform(p, [0, 0.25], ["22vw", "0vw"]);
  const frameScale = useTransform(p, [0, 0.25], [1.2, 1]);
  const frameOverflow = useTransform(p, (v) => (v < 0.207 ? "visible" : "hidden"));
  const imageScale = useTransform(p, [0, 0.25], [1.15, 1]);
  const boxReveal = useTransform(p, [0.207, 0.267], [0, 1]);

  const heroOpacity = useTransform(p, [0, 0.107], [1, 0]);
  const heroY = useTransform(p, [0, 0.107], ["0px", "-32px"]);

  // About columns: in, hold while she is read, then out
  const storyOpacity = useTransform(p, [0.15, 0.267, 0.4, 0.48], [0, 1, 1, 0]);
  const storyY = useTransform(p, [0.15, 0.267, 0.4, 0.48], ["32px", "0px", "0px", "-24px"]);
  const storyPointer = useTransform(p, (v) => (v > 0.2 && v < 0.44 ? "auto" : "none"));

  /* ---- Chapter 3: skills ring ---- */
  const reveal = useTransform(p, [0.46, 0.62], [0, 1]);
  const panelOpacity = useTransform(p, [0.58, 0.68], [0, 1]);
  const panelPointer = useTransform(p, (v) => (v > 0.6 ? "auto" : "none"));

  // Scrolling turns the ring; clicks add a manual offset on top.
  const scrollRot = useTransform(p, [0.64, 0.98], [0, -(360 - STEP)]);
  const userOffset = useMotionValue(0);
  const rotation = useTransform(
    [scrollRot, userOffset],
    ([a, b]: number[]) => a + b
  );

  useMotionValueEvent(rotation, "change", (r) => {
    const i = mod(Math.round(-r / STEP), SKILLS.length);
    setFront((prev) => (prev === i ? prev : i));
  });

  const goTo = (i: number) => {
    const offset = userOffset.get();
    const total = rotation.get();
    const delta = mod(-i * STEP - total + 180, 360) - 180; // shortest way round
    anim.current?.stop();
    anim.current = animate(userOffset, offset + delta, {
      duration: reduce ? 0 : 0.9,
      ease: EASE,
    });
  };
  const step = (dir: 1 | -1) => goTo(mod(front + dir, SKILLS.length));

  const active = SKILLS[front];
  const mobileSkill = SKILLS[mobileIndex];
  const MobileIcon = mobileSkill.icon;

  return (
    <div
      id="home"
      ref={containerRef}
      className="relative h-auto text-[var(--text-white)] min-[1100px]:h-[400vh]"
    >
      {/* Desktop scroll anchors for the navbar (it picks whichever is visible) */}
      <span
        data-anchor="about"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[90vh] hidden h-px w-px min-[1100px]:block"
      />
      <span
        data-anchor="skills"
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[190vh] hidden h-px w-px min-[1100px]:block"
      />

      <div className="flex w-full flex-col items-start justify-center min-[1100px]:sticky min-[1100px]:top-0 min-[1100px]:h-screen min-[1100px]:flex-row min-[1100px]:items-center min-[1100px]:overflow-hidden min-[1100px]:pt-16">
        {/* Watermark */}
        <motion.span
          aria-hidden="true"
          style={{ opacity: heroOpacity, ...displayFont }}
          className="watermark pointer-events-none absolute left-6 top-1/2 z-0 hidden -translate-y-1/2 select-none text-[18vw] leading-none min-[1100px]:block"
        >
          Nabeeha
        </motion.span>

        {/* ========================= DESKTOP ========================= */}
        <div className="relative z-10 hidden h-full w-full max-w-[94%] items-center justify-center min-[1100px]:flex">
          <h2 className="sr-only">{CONTENT.skillsTitle}</h2>

          {/* Halo behind her: thin circles that travel with the frame */}
          <motion.div
            aria-hidden="true"
            style={{ x: frameX }}
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          >
            <Rings className="h-[880px] w-[880px] max-w-none shrink-0" rings={5} />
          </motion.div>

          {/* Orbit path (behind her) */}
          <motion.div
            aria-hidden="true"
            style={{ opacity: reveal, marginTop: BASE_Y - LIFT }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[88px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[var(--glass-border)]"
          />

          {/* Portrait frame: the centrepiece of all three chapters */}
          <motion.div
            style={{
              x: frameX,
              scale: frameScale,
              overflow: frameOverflow,
              willChange: "transform",
            }}
            className="relative z-10 h-[480px] w-[345px] shrink-0 rounded-[28px] min-[1280px]:h-[540px] min-[1280px]:w-[390px]"
          >
            <motion.div
              style={{ opacity: boxReveal }}
              className="pointer-events-none absolute inset-0 z-0 rounded-[28px] shadow-2xl shadow-black"
            />
            <motion.div
              style={{ opacity: boxReveal }}
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[28px] bg-[var(--dark-200)]"
            >
              {/* static light, no blur filters */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(70% 55% at 12% 6%, rgba(173,125,86,0.5), transparent 70%), radial-gradient(60% 50% at 95% 98%, rgba(205,180,158,0.28), transparent 70%)",
                }}
              />
            </motion.div>

            <motion.div
              style={{ opacity: boxReveal }}
              className="pointer-events-none absolute inset-0 z-10 rounded-[28px] bg-gradient-to-b from-[var(--overlay-accent)] via-transparent to-[var(--overlay-dark)]"
            />
            <motion.div
              style={{ opacity: boxReveal }}
              className="pointer-events-none absolute inset-0 z-20 rounded-[28px] border border-[var(--glass-border)]"
            />

            <motion.div
              style={{ scale: imageScale }}
              className="absolute -left-[18%] top-0 z-[5] h-full w-[136%]"
            >
              <Portrait sizes="(max-width: 1100px) 90vw, 40vw" priority />
            </motion.div>
          </motion.div>

          {/* Skill ring: cards pass in front of and behind her */}
          {SKILLS.map((s, i) => (
            <RingCard
              key={s.id}
              skill={s}
              index={i}
              rotation={rotation}
              reveal={reveal}
              isFront={front === i}
              interactive={ringOn}
              onSelect={() => goTo(i)}
              onStep={step}
            />
          ))}

          {/* Chapter 1: opening statement */}
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="pointer-events-none absolute left-6 top-1/2 z-20 max-w-lg -translate-y-1/2 space-y-6 min-[1280px]:left-14"
          >
            <RevealTitle
              text={CONTENT.name}
              as="h1"
              className="text-6xl leading-[1.1] text-sheen min-[1280px]:text-7xl"
              style={displayFont}
            />
            <p className="text-xl text-[var(--light-200)]">{CONTENT.role}</p>
            <p className="max-w-md leading-relaxed text-[var(--light-400)]">{CONTENT.intro}</p>
            <Credentials />
            <div className="pt-2">
              <ScrollCue>Scroll to read her story</ScrollCue>
            </div>
          </motion.div>

          {/* Chapter 2: story columns */}
          <motion.div
            style={{ opacity: storyOpacity, y: storyY }}
            className="pointer-events-none absolute inset-x-2 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between min-[1280px]:inset-x-6"
          >
            <motion.div
              style={{ pointerEvents: storyPointer }}
              className="glass w-[clamp(15rem,22vw,22rem)] space-y-4 rounded-3xl p-6 text-left"
            >
              <div className="flex items-center gap-2 text-[var(--fb-300)]">
                <MapPin size={16} aria-hidden="true" />
                <span className={labelClass}>{CONTENT.origin.label}</span>
              </div>
              <RevealTitle
                text={CONTENT.origin.title}
                active={storyOn}
                className="text-3xl leading-[1.15] text-[var(--text-white)] min-[1280px]:text-4xl"
                style={displayFont}
              />
              <p className="text-[13px] leading-[1.75] text-[var(--light-300)] min-[1280px]:text-sm">
                <RichText segments={CONTENT.origin.body} interactive />
              </p>
              <figure className="border-l-2 border-[var(--fb-500)] pl-4">
                <blockquote className="text-sm italic leading-relaxed text-[var(--light-400)]">
                  &ldquo;{CONTENT.origin.quote}&rdquo;
                </blockquote>
              </figure>
            </motion.div>

            <motion.div
              style={{ pointerEvents: storyPointer }}
              className="glass w-[clamp(15rem,22vw,22rem)] space-y-4 rounded-3xl p-6 text-left"
            >
              <div className="flex items-center gap-2 text-[var(--fb-300)]">
                <Code2 size={16} aria-hidden="true" />
                <span className={labelClass}>{CONTENT.craft.label}</span>
              </div>
              <RevealTitle
                text={CONTENT.craft.title}
                active={storyOn}
                className="text-3xl leading-[1.15] text-[var(--text-white)] min-[1280px]:text-4xl"
                style={displayFont}
              />
              <p className="text-[13px] leading-[1.75] text-[var(--light-300)] min-[1280px]:text-sm">
                <RichText segments={CONTENT.craft.body} interactive />
              </p>
              <TagList items={CONTENT.craft.chips} />
              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton href="#projects">View projects</PrimaryButton>
                <SecondaryButton href="#contact">Get in touch</SecondaryButton>
              </div>
            </motion.div>
          </motion.div>

          {/* Chapter 3: skill detail (left) */}
          <motion.div
            style={{ opacity: panelOpacity, pointerEvents: panelPointer }}
            className="glass absolute left-0 top-[6%] z-30 w-[250px] space-y-4 rounded-2xl p-5"
          >
            <span className={labelClass}>{CONTENT.skillsLabel}</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <SkillDetail skill={active} />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Chapter 3: stamp (top right) */}
          <motion.div
            style={{ opacity: panelOpacity }}
            className="absolute right-6 top-[6%] z-30"
          >
            <Badge />
          </motion.div>

          {/* Chapter 3: controls (bottom right) */}
          <motion.div
            style={{ opacity: panelOpacity, pointerEvents: panelPointer }}
            className="glass absolute bottom-6 right-0 z-30 w-[250px] space-y-3 rounded-2xl p-4"
          >
            <p className="text-xs text-[var(--light-400)]">
              Keep scrolling to turn the ring, or pick a card.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--light-400)]" aria-hidden="true">
                {front + 1} of {SKILLS.length}
              </span>
              <div className="flex items-center gap-2">
                {[
                  { label: "Previous skill", icon: ChevronLeft, dir: -1 as const },
                  { label: "Next skill", icon: ChevronRight, dir: 1 as const },
                ].map(({ label, icon: I, dir }) => (
                  <button
                    key={label}
                    type="button"
                    tabIndex={ringOn ? 0 : -1}
                    onClick={() => step(dir)}
                    aria-label={label}
                    className="icon-btn h-9 w-9"
                  >
                    <I size={16} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===================== MOBILE / TABLET ===================== */}
        <div className="relative flex w-full flex-col items-center gap-10 px-5 pb-16 pt-28 text-center sm:px-6 min-[1100px]:hidden">
          <Watermark className="left-1/2 top-24 -translate-x-1/2 text-[34vw] sm:text-[26vw]">
            Nabeeha
          </Watermark>

          <div className="relative w-full max-w-xs">
            <Glow className="-inset-10 z-0" strength={0.35} />
            <div className="glass-flat relative z-10 aspect-[4/5] overflow-hidden rounded-[2rem] !border-[var(--glass-border)] shadow-2xl shadow-black">
              <Portrait sizes="90vw" priority />
            </div>
          </div>

          <div className="relative max-w-md space-y-4">
            <RevealTitle
              text={CONTENT.name}
              as="h1"
              className="text-5xl leading-[1.1] text-sheen sm:text-6xl"
              style={displayFont}
            />
            <p className="text-lg text-[var(--light-200)]">{CONTENT.role}</p>
            <p className="leading-relaxed text-[var(--light-400)]">{CONTENT.intro}</p>
            <div className="flex justify-center pt-2">
              <Credentials />
            </div>
          </div>

          <div
            data-anchor="about"
            className="relative flex w-full scroll-mt-24 flex-col items-center gap-6"
          >
            <section
              aria-labelledby="about-origin"
              className="glass w-full max-w-md space-y-3 rounded-3xl p-6 text-left"
            >
              <span className={`${labelClass} flex items-center gap-2`}>
                <MapPin size={14} aria-hidden="true" /> {CONTENT.origin.label}
              </span>
              <h2
                id="about-origin"
                className="text-3xl leading-[1.15] text-[var(--text-white)]"
                style={displayFont}
              >
                {CONTENT.origin.title}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--light-300)]">
                <RichText segments={CONTENT.origin.body} interactive={false} />
              </p>
              <p className="border-t border-[var(--glass-border)] pt-3 text-sm italic text-[var(--light-400)]">
                &ldquo;{CONTENT.origin.quote}&rdquo;
              </p>
            </section>

            <section
              aria-labelledby="about-craft"
              className="glass w-full max-w-md space-y-4 rounded-3xl p-6 text-left"
            >
              <span className={`${labelClass} flex items-center gap-2`}>
                <Code2 size={14} aria-hidden="true" /> {CONTENT.craft.label}
              </span>
              <h2
                id="about-craft"
                className="text-3xl leading-[1.15] text-[var(--text-white)]"
                style={displayFont}
              >
                {CONTENT.craft.title}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--light-300)]">
                <RichText segments={CONTENT.craft.body} interactive={false} />
              </p>
              <TagList items={CONTENT.craft.chips} />
              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton href="#projects">View projects</PrimaryButton>
                <SecondaryButton href="#contact">Get in touch</SecondaryButton>
              </div>
            </section>
          </div>

          {/* Skills (mobile): her portrait again, with the active skill overlapping it */}
          <section
            data-anchor="skills"
            aria-labelledby="skills-title-m"
            className="relative flex w-full max-w-md scroll-mt-24 flex-col items-center pt-6"
          >
            <h2
              id="skills-title-m"
              className="text-4xl leading-[1.15] text-[var(--text-white)]"
              style={displayFont}
            >
              {CONTENT.skillsTitle}
            </h2>
            <p className="mt-3 text-sm text-[var(--light-400)]">
              Pick a skill to see what she does with it.
            </p>

            <div className="relative mt-10 h-[260px] w-[190px]">
              <Glow className="left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2" strength={0.35} />
              <div className="glass-flat relative h-full w-full overflow-hidden rounded-[1.75rem] shadow-2xl shadow-black">
                <Portrait sizes="190px" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileSkill.id}
                  initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="glass absolute -bottom-6 left-1/2 z-10 flex w-[250px] -translate-x-1/2 items-center gap-3 rounded-2xl !border-[var(--fb-400)] p-3.5 text-left"
                >
                  <span className={`h-10 w-10 ${iconTile}`}>
                    <MobileIcon size={20} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{mobileSkill.title}</span>
                    <span className="block text-xs text-[var(--light-400)]">
                      {mobileSkill.line}
                    </span>
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="glass mt-14 w-full rounded-2xl p-5 text-left" aria-live="polite">
              <SkillDetail skill={mobileSkill} />
            </div>

            <div
              role="group"
              aria-label="Choose a skill"
              className="mt-6 flex w-full gap-2 overflow-x-auto pb-2"
            >
              {SKILLS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setMobileIndex(i)}
                  aria-pressed={mobileIndex === i}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                    mobileIndex === i
                      ? "border-[var(--fb-400)] bg-[var(--fb-500)] font-semibold text-black"
                      : "border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--light-300)]"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}