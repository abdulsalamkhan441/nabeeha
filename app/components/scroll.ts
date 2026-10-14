/** Find the visible element for a nav id: a [data-anchor] first, then #id. */
export function findTarget(id: string): HTMLElement | null {
  const list = Array.from(document.querySelectorAll<HTMLElement>(`[data-anchor="${id}"]`));
  const visible = list.find((n) => n.offsetParent !== null);
  return visible ?? document.getElementById(id);
}

export const anchorTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

type LenisLike = { scrollTo: (t: HTMLElement | number, o?: Record<string, unknown>) => void };

export function scrollToId(id: string, reduce = false): boolean {
  const el = findTarget(id);
  if (!el) return false;
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis && !reduce) {
    lenis.scrollTo(el, { offset: id === "home" ? 0 : -64, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  return true;
}