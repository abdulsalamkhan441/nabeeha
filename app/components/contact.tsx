"use client";

import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { Glow, Rings, Watermark, displayFont } from "./ui";

/* ------------------------------------------------------------------ */
/* CUSTOM SOCIAL SVG COMPONENTS (no extra icon packages needed)        */
/* ------------------------------------------------------------------ */
function GithubIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
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

function LinkedinIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
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
const CONTACT = {
  email: "hello@yourdomain.com",
  phone: "+92 300 0000000",
  location: "Karachi, Pakistan",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: LinkedinIcon },
    { label: "GitHub", href: "https://github.com/", icon: GithubIcon },
  ] as { label: string; href: string; icon: React.FC<{ size?: number; className?: string }> }[],
  points: [
    "A personal reply, never a template",
    "Clear scope and honest timelines",
    "Accessible, responsive work as standard",
  ],
  formEndpoint: "",
};

const COPY = {
  title: "Reach out",
  intro:
    "Have a project in mind, a role to fill, or just a question? Send a message and Nabeeha will get back to you.",
};

/* ------------------------------------------------------------------ */
/* FORM LOGIC                                                         */
/* ------------------------------------------------------------------ */
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "opened" | "error";

function validate(v: Record<Field, string>): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  // Fixed: the old pattern ended in \$ (a literal dollar sign), so no email ever passed.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
    e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10)
    e.message = "Please write a little more (at least 10 characters).";
  return e;
}

const inputClass =
  "w-full rounded-2xl border bg-[rgba(0,0,0,0.35)] px-4 py-3.5 text-sm text-[var(--text-white)] placeholder:text-[var(--light-500)] transition-colors focus:border-[var(--fb-400)] focus:bg-[rgba(0,0,0,0.5)]";

function FieldShell({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs text-[var(--light-300)]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-[var(--error)]">
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    email: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [f]: e.target.value }));
    if (errors[f]) setErrors((er) => ({ ...er, [f]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    const firstBad = (["name", "email", "message"] as Field[]).find((f) => errs[f]);
    if (firstBad) {
      document.getElementById(`contact-${firstBad}`)?.focus();
      return;
    }
    if (honeypot) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      if (CONTACT.formEndpoint) {
        const res = await fetch(CONTACT.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Request failed");
        setStatus("sent");
      } else {
        const subject = encodeURIComponent(`Message from ${values.name.trim()}`);
        const body = encodeURIComponent(
          `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`
        );
        window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
        setStatus("opened");
      }
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setErrors({});
    setStatus("idle");
  };

  const done = status === "sent" || status === "opened";

  return (
    <div className="relative">
      <Glow className="-right-16 -top-16 h-72 w-72" strength={0.35} />
      <div className="glass relative min-h-[26rem] rounded-3xl p-5 sm:p-7">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="done"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              role="status"
              className="flex min-h-[24rem] flex-col items-center justify-center gap-4 px-2 text-center sm:px-6"
            >
              <CheckCircle2 size={40} className="text-[var(--rd-300)]" aria-hidden="true" />
              <h3 className="text-4xl leading-tight" style={displayFont}>
                {status === "sent" ? "Message sent" : "Almost there"}
              </h3>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--light-300)]">
                {status === "sent"
                  ? "Thank you. Nabeeha will read your message and reply by email."
                  : `Your email app should have opened with your message ready to send. If it didn't, write to ${CONTACT.email}.`}
              </p>
              <button type="button" onClick={reset} className="btn-ghost mt-2">
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              noValidate
              initial={false}
              exit={{ opacity: 0 }}
              className="relative space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldShell id="contact-name" label="Name" error={errors.name}>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={set("name")}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={`${inputClass} ${errors.name ? "border-[var(--error)]" : "border-[var(--glass-border)]"}`}
                  />
                </FieldShell>
                <FieldShell id="contact-email" label="Email" error={errors.email}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={set("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={`${inputClass} ${errors.email ? "border-[var(--error)]" : "border-[var(--glass-border)]"}`}
                  />
                </FieldShell>
              </div>

              <FieldShell id="contact-message" label="Message" error={errors.message}>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={7}
                  placeholder="Tell her about your project or question"
                  value={values.message}
                  onChange={set("message")}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                  className={`${inputClass} resize-none ${errors.message ? "border-[var(--error)]" : "border-[var(--glass-border)]"}`}
                />
              </FieldShell>

              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Company
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary w-full !py-4"
              >
                {status === "sending" ? "Sending..." : "Send message"}
                {status !== "sending" && <ArrowUpRight size={16} aria-hidden="true" />}
              </button>

              <p role="alert" className="min-h-[1.25rem] text-center text-xs text-[var(--error)]">
                {status === "error"
                  ? `Something went wrong. Please try again, or write to ${CONTACT.email}.`
                  : ""}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* INFO CARD                                                          */
/* ------------------------------------------------------------------ */
function InfoCard({
  icon: Icon,
  label,
  value,
  href,
  index,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  const inner = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--rd-300)]">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="mt-8 block">
        <span className="block text-sm font-semibold text-[var(--text-white)]">{label}</span>
        <span className="mt-1 block break-words text-sm text-[var(--light-400)]">{value}</span>
      </span>
    </>
  );
  const cls = "glass glass-hover group relative block overflow-hidden rounded-2xl p-5";

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {href ? (
        <a
          href={href}
          className={cls}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: "radial-gradient(closest-side, rgba(173,125,86,0.4), transparent)",
            }}
          />
          <span className="relative block">{inner}</span>
        </a>
      ) : (
        <div className={cls}>
          <span className="relative block">{inner}</span>
        </div>
      )}
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN                                                               */
/* ------------------------------------------------------------------ */
export default function ContactSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative overflow-hidden px-4 pb-24 pt-28 text-[var(--text-white)] sm:px-6 sm:pb-32 sm:pt-36"
    >
      <div className="hairline absolute inset-x-0 top-0" />
      <Watermark className="-left-[2vw] top-14 text-[30vw] sm:top-8 lg:text-[19vw]">Hello</Watermark>
      <Rings className="absolute -left-40 top-1/3 h-[760px] w-[760px] max-w-none" rings={4} />
      <Glow className="-left-24 top-[20%] h-[520px] w-[520px]" strength={0.2} />

      <div className="relative mx-auto max-w-[1100px]">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
          {/* Left: words */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 lg:pt-6"
          >
            <h2
              id="contact-title"
              className="group flex items-center gap-4 text-6xl leading-[1.1] sm:text-7xl"
              style={displayFont}
            >
              <span className="text-sheen">{COPY.title}</span>
              <ArrowUpRight
                aria-hidden="true"
                className="h-9 w-9 shrink-0 text-[var(--fb-400)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </h2>

            <p className="max-w-sm leading-relaxed text-[var(--light-300)]">{COPY.intro}</p>

            <ul className="space-y-4">
              {CONTACT.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-[var(--light-200)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass-fill)] text-[var(--rd-300)]">
                    <Check size={14} aria-hidden="true" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            {CONTACT.socials.length > 0 && (
              <ul className="flex gap-3 pt-2">
                {CONTACT.socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="icon-btn h-11 w-11 !rounded-xl"
                    >
                      <Icon size={18} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Right: the form */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* Three ways to reach her */}
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <InfoCard
            index={0}
            icon={Mail}
            label="Email"
            value={CONTACT.email}
            href={`mailto:${CONTACT.email}`}
          />
          <InfoCard
            index={1}
            icon={Phone}
            label="Call"
            value={CONTACT.phone}
            href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
          />
          <InfoCard
            index={2}
            icon={MapPin}
            label="Based in"
            value={CONTACT.location}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.location)}`}
          />
        </ul>
      </div>
    </section>
  );
}