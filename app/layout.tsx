import type { Metadata } from "next";
import { Lora, Praise } from "next/font/google";
import "./globals.css";
import SiteBackground from "./components/sitebackground";
import SmoothScroll from "./components/smoothscrol";
import Navbar from "./components/navbar";

const praise = Praise({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nabeeha Maqsood | Front-end developer",
  description:
    "Front-end developer who ships the whole stack. Fast, accessible interfaces and the back-end that powers them.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${praise.variable} ${lora.variable}`}>
      <body className="antialiased">
        <SiteBackground />
        <SmoothScroll />
        <Navbar />
        {children}
      </body>
    </html>
  );
}