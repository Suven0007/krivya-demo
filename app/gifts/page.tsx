import type { Metadata } from "next";
import Link from "next/link";
import { GiftBuilder } from "@/components/GiftBuilder";
import { krivyaWhatsAppNumber } from "@/lib/requests/whatsapp";

const defaultMessage = "Hi Krivya, I'd like to create a personalized gift.";
const whatsappHref = `https://wa.me/${krivyaWhatsAppNumber}?text=${encodeURIComponent(defaultMessage)}`;

export const metadata: Metadata = {
  title: "Gift Store | Krivya",
  description: "Browse Krivya gift ideas, add pieces to your gift basket, and create a personalized Request ID for WhatsApp.",
};

export default function GiftsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-ink">
      <a
        href="#create-gift"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to Gift Store
      </a>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="focus-ring flex items-center gap-3 rounded-sm" aria-label="Krivya home">
            <span className="grid size-10 place-items-center rounded-full bg-ribbon text-base font-black text-ink">K</span>
            <span>
              <span className="block font-serif text-2xl font-bold leading-6 text-white">Krivya</span>
              <span className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-ribbon">Love Across Miles</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3 text-sm font-bold" aria-label="Gift Store navigation">
            <Link className="focus-ring hidden rounded-full border border-white/15 px-4 py-2.5 text-white/82 transition hover:bg-white/10 sm:inline-flex" href="/">
              Home
            </Link>
            <a className="focus-ring rounded-full bg-ribbon px-4 py-2.5 text-ink transition hover:bg-white" href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </nav>
        </div>
      </header>

      <GiftBuilder />
    </main>
  );
}
