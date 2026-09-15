"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GiftBuilder } from "@/components/GiftBuilder";
import { deliveryDestinations } from "@/lib/requests/catalog";
import { krivyaWhatsAppNumber } from "@/lib/requests/whatsapp";

const defaultMessage = "Hi Krivya, I'd like to create a personalized gift.";
const whatsappHref = `https://wa.me/${krivyaWhatsAppNumber}?text=${encodeURIComponent(defaultMessage)}`;

const navItems = [
  { label: "Occasions", href: "#occasions" },
  { label: "Creations", href: "#creations" },
  { label: "Personalize", href: "#personalize" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Gift Builder", href: "#create-gift" },
];

const heroImages = [
  { src: "/images/1.jpeg", alt: "Pink Krivya hamper with roses, teddy bear, chocolates, and a photo keepsake" },
  { src: "/images/3.jpeg", alt: "Personalized Krivya gift box with chocolates, jars, flowers, and letter board" },
  { src: "/images/4.jpeg", alt: "Baby gift arrangement with balloons, plush toy, flowers, and wrapped items" },
];

const occasions = [
  { name: "Love & Romance", image: "/images/13.jpeg", note: "Roses, chocolates, soft toys, and small keepsakes." },
  { name: "Birthdays", image: "/images/8.jpeg", note: "Bright bouquets, treats, frames, and cheerful plush details." },
  { name: "Baby welcomes", image: "/images/4.jpeg", note: "Gentle palettes, babywear, balloons, and sweet details." },
  { name: "Just Because", image: "/images/2.jpeg", note: "Warm, personal gestures for people you want to surprise." },
];

const featured = [
  { title: "Recent Creation", image: "/images/17.jpeg", tag: "Romantic" },
  { title: "Personalized Gift Inspiration", image: "/images/10.jpeg", tag: "Memory-led" },
  { title: "Elegant Gift Inspiration", image: "/images/5.jpeg", tag: "Refined" },
  { title: "Birthday Gift Inspiration", image: "/images/8.jpeg", tag: "Joyful" },
  { title: "Soft Toy Gift Inspiration", image: "/images/6.jpeg", tag: "Warm" },
  { title: "Chocolate Gift Inspiration", image: "/images/15.jpeg", tag: "Sweet" },
];

const gallery = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/8.jpeg",
  "/images/10.jpeg",
  "/images/13.jpeg",
  "/images/15.jpeg",
  "/images/16.jpeg",
  "/images/17.jpeg",
  "/images/29.jpeg",
];

const details = [
  { label: "Photo frames", image: "/images/29.jpeg" },
  { label: "Custom mugs", image: "/images/24.jpeg" },
  { label: "Message bottles", image: "/images/26.jpeg" },
  { label: "Candles", image: "/images/28.jpeg" },
  { label: "Chocolates", image: "/images/22.jpeg" },
  { label: "Keepsakes", image: "/images/23.jpeg" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden pb-16 lg:pb-0">
      <a
        href="#create-gift"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to Gift Builder
      </a>

      <div className="bg-ink px-4 py-3 text-center text-sm font-semibold text-white">
        Personalized gifts for thoughtful deliveries. Build your request first, then continue with Krivya on WhatsApp.
      </div>

      <header className="sticky top-0 z-40 border-b border-plum/10 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="focus-ring flex items-center gap-3 rounded-sm" aria-label="Krivya home">
            <span className="grid size-11 place-items-center rounded-full bg-plum text-lg font-black text-white">K</span>
            <span>
              <span className="block font-serif text-2xl font-bold leading-6 text-plum">Krivya</span>
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-sage">Love Across Miles</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-ink/75 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <a key={item.href} className="focus-ring rounded-sm transition hover:text-plum" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link className="focus-ring rounded-full border border-plum/20 px-5 py-3 text-sm font-bold text-plum transition hover:bg-plum hover:text-white" href="/admin-demo">
              Demo Dashboard
            </Link>
            <a className="focus-ring rounded-full bg-plum px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-rose" href="#create-gift">
              Build a Gift
            </a>
          </div>

          <button
            type="button"
            className="focus-ring inline-flex size-11 items-center justify-center rounded-full border border-plum/20 text-plum lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-2 h-0.5 w-5 bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-4 h-0.5 w-5 bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <nav id="mobile-menu" className="border-t border-plum/10 bg-white px-4 pb-5 lg:hidden" aria-label="Mobile navigation">
            <div className="mx-auto grid max-w-7xl gap-2">
              {navItems.map((item) => (
                <a key={item.href} className="focus-ring rounded-sm px-2 py-3 text-base font-bold text-ink" href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
              <Link className="focus-ring rounded-sm px-2 py-3 text-base font-bold text-ink" href="/admin-demo" onClick={() => setMenuOpen(false)}>
                Demo Dashboard
              </Link>
              <a className="focus-ring mt-2 rounded-full bg-plum px-5 py-3 text-center text-sm font-bold text-white" href="#create-gift" onClick={() => setMenuOpen(false)}>
                Open Gift Builder
              </a>
            </div>
          </nav>
        ) : null}
      </header>

      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 w-fit rounded-full border border-rose/25 bg-white/75 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-rose">Love Across Miles</p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-ink text-balance sm:text-6xl lg:text-7xl">
              Build a personal gift request in minutes.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72">
              Choose the destination, occasion, gift inspiration, and personal notes before starting the WhatsApp conversation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="focus-ring rounded-full bg-plum px-7 py-4 text-center text-base font-bold text-white shadow-soft transition hover:bg-rose" href="#create-gift">
                Start Gift Builder
              </a>
              <a className="focus-ring rounded-full border border-plum/20 bg-white/70 px-7 py-4 text-center text-base font-bold text-plum transition hover:bg-white" href="#creations">
                View inspiration
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-ink/70">
              {deliveryDestinations.map((country) => (
                <span key={country} className="rounded-full bg-white/72 px-4 py-2 shadow-sm">
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div className="grid min-h-[520px] grid-cols-12 grid-rows-12 gap-4 sm:min-h-[680px]">
            {heroImages.map((image, index) => (
              <div
                key={image.src}
                className={[
                  "relative overflow-hidden rounded-[2rem] bg-white shadow-soft",
                  index === 0 ? "col-span-8 row-span-7" : "",
                  index === 1 ? "col-span-7 col-start-6 row-span-6 row-start-5" : "",
                  index === 2 ? "col-span-5 col-start-1 row-span-5 row-start-8" : "",
                ].join(" ")}
              >
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 42vw, 92vw" priority={index === 0} className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-plum/10 bg-white/72 px-4 py-5 sm:px-6 lg:px-8" aria-label="Gift request benefit">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-ink/72 md:flex-row md:items-center md:justify-between">
          <p>
            <strong className="text-ink">Less back-and-forth:</strong> your Request ID keeps the gift details together so Krivya can review them clearly.
          </p>
          <a className="focus-ring rounded-sm font-bold text-plum underline-offset-4 hover:underline" href="#create-gift">
            Build your request
          </a>
        </div>
      </section>

      <section id="occasions" className="section-pad px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose">Gift by occasion</p>
            <h2 className="font-serif text-4xl font-bold text-ink text-balance sm:text-5xl">Choose the feeling first. Build the request around it.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {occasions.map((occasion) => (
              <article key={occasion.name} className="group overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={occasion.image} alt={`${occasion.name} Krivya gift inspiration`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black text-ink">{occasion.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/68">{occasion.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="creations" className="section-pad bg-ink px-4 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-ribbon">Featured Krivya creations</p>
              <h2 className="font-serif text-4xl font-bold text-balance sm:text-5xl">Gift inspiration with room to personalize.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-white/70">
              Use these arrangements as direction for a request. Krivya can confirm what is available before preparing the gift.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-2xl bg-white/8 ring-1 ring-white/12">
                <div className="relative aspect-[5/6] overflow-hidden">
                  <Image src={item.image} alt={`${item.title} by Krivya`} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <span className="shrink-0 rounded-full bg-ribbon px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-ink">{item.tag}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GiftBuilder />

      <section id="personalize" className="section-pad px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose">Personalization</p>
            <h2 className="font-serif text-4xl font-bold text-ink text-balance sm:text-5xl">Layer the small things that make the gift unmistakably theirs.</h2>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              Photos, handwritten notes, mugs, candles, chocolates, message bottles, flowers, and soft toys can all become part of a guided request.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {details.map((detail) => (
              <figure key={detail.label} className="overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="relative aspect-square">
                  <Image src={detail.image} alt={`Krivya ${detail.label.toLowerCase()} inspiration`} fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="px-4 py-3 text-sm font-black text-ink">{detail.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-pad px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose">How it works</p>
            <h2 className="font-serif text-4xl font-bold text-ink sm:text-5xl">From idea to Request ID.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Build the request", "Choose the destination, occasion, gift inspiration, and personal details in one guided flow."],
              ["Get a Request ID", "Your browser saves the demo request and gives you a clear Gift Request ID to share."],
              ["Continue on WhatsApp", "Send the Request ID to Krivya so they can review the details and confirm availability."],
            ].map(([title, copy], index) => (
              <article key={title} className="rounded-2xl border border-plum/10 bg-white/74 p-6 shadow-sm">
                <span className="mb-8 grid size-12 place-items-center rounded-full bg-plum font-serif text-xl font-bold text-white">{index + 1}</span>
                <h3 className="text-2xl font-black text-ink">{title}</h3>
                <p className="mt-4 leading-7 text-ink/68">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-plum px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-ribbon">Destinations</p>
            <h2 className="font-serif text-4xl font-bold text-balance sm:text-5xl">Built for gifts sent with care, even when the sender is far away.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {deliveryDestinations.map((country) => (
              <div key={country} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                <p className="text-lg font-black">{country}</p>
                <p className="mt-2 text-sm leading-6 text-white/68">Confirm service availability, timing, and delivery details with Krivya.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad px-4 sm:px-6 lg:px-8" aria-labelledby="gallery-title">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose">Gallery</p>
              <h2 id="gallery-title" className="font-serif text-4xl font-bold text-ink sm:text-5xl">Ideas for your personalized request.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-ink/68">
              Browse arrangements, keepsakes, and details that can help you describe the gift you want Krivya to prepare.
            </p>
          </div>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
            {gallery.map((src, index) => (
              <figure key={src} className="mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-soft">
                <Image src={src} alt={`Krivya gift inspiration ${index + 1}`} width={700} height={920} className="h-auto w-full object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] bg-white p-8 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose">Love Across Miles</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">Ready to shape something personal?</h2>
          </div>
          <a className="focus-ring rounded-full bg-plum px-7 py-4 text-center text-base font-black text-white transition hover:bg-rose" href="#create-gift">
            Build a Gift Request
          </a>
        </div>
      </section>

      <footer className="border-t border-plum/10 bg-white/80 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-ink/68 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-3xl font-bold text-plum">Krivya</p>
            <p className="mt-2">Love Across Miles. Concept website redesign for demonstration purposes.</p>
          </div>
          <div className="flex flex-wrap gap-4 font-bold text-ink">
            {navItems.map((item) => (
              <a key={item.href} className="focus-ring rounded-sm hover:text-plum" href={item.href}>
                {item.label}
              </a>
            ))}
            <Link className="focus-ring rounded-sm hover:text-plum" href="/admin-demo">
              Admin Demo
            </Link>
            <a className="focus-ring rounded-sm hover:text-plum" href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
