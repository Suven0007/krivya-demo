"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { deliveryDestinations } from "@/lib/requests/catalog";
import { krivyaWhatsAppNumber } from "@/lib/requests/whatsapp";

const defaultMessage = "Hi Krivya, I'd like to create a personalized gift.";
const whatsappHref = `https://wa.me/${krivyaWhatsAppNumber}?text=${encodeURIComponent(defaultMessage)}`;

const navItems = [
  { label: "Gifts", href: "/gifts" },
  { label: "Occasions", href: "#occasions" },
  { label: "How It Works", href: "#how-it-works" },
];

const occasions = [
  { name: "Birthday", image: "/images/8.jpeg", note: "Bright florals, treats, and personal details." },
  { name: "Love & Anniversary", image: "/images/13.jpeg", note: "Roses, chocolates, soft toys, and keepsakes." },
  { name: "Baby", image: "/images/4.jpeg", note: "Gentle colors, plush details, and soft arrangements." },
  { name: "Just Because", image: "/images/2.jpeg", note: "Warm surprises for the people you miss." },
];

const featured = [
  { title: "Romantic Gift Inspiration", image: "/images/17.jpeg" },
  { title: "Personalized Gift Inspiration", image: "/images/10.jpeg" },
  { title: "Birthday Gift Inspiration", image: "/images/8.jpeg" },
  { title: "Soft Toy Gift Inspiration", image: "/images/6.jpeg" },
];

const personalTouches = [
  { label: "Photo", image: "/images/29.jpeg" },
  { label: "Message", image: "/images/26.jpeg" },
  { label: "Flowers", image: "/images/21.jpeg" },
  { label: "Chocolate", image: "/images/22.jpeg" },
  { label: "Keepsake", image: "/images/23.jpeg" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden">
      <a
        href="#main-content"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-plum/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="focus-ring flex items-center gap-3 rounded-sm" aria-label="Krivya home">
            <span className="grid size-10 place-items-center rounded-full bg-plum text-base font-black text-white">K</span>
            <span>
              <span className="block font-serif text-2xl font-bold leading-6 text-plum">Krivya</span>
              <span className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-sage">Love Across Miles</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-ink/75 lg:flex" aria-label="Main navigation">
            {navItems.map((item) =>
              item.href.startsWith("/") ? (
                <Link key={item.href} className="focus-ring rounded-sm transition hover:text-plum" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.href} className="focus-ring rounded-sm transition hover:text-plum" href={item.href}>
                  {item.label}
                </a>
              ),
            )}
            <a className="focus-ring rounded-sm transition hover:text-plum" href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </nav>

          <div className="hidden lg:block">
            <Link className="focus-ring rounded-full bg-plum px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-rose" href="/gifts">
              Create a Gift
            </Link>
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
            <div className="mx-auto grid max-w-7xl gap-1">
              {navItems.map((item) =>
                item.href.startsWith("/") ? (
                  <Link key={item.href} className="focus-ring rounded-sm px-2 py-3 text-base font-bold text-ink" href={item.href} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.href} className="focus-ring rounded-sm px-2 py-3 text-base font-bold text-ink" href={item.href} onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </a>
                ),
              )}
              <a className="focus-ring rounded-sm px-2 py-3 text-base font-bold text-ink" href={whatsappHref} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>
                WhatsApp
              </a>
              <Link className="focus-ring mt-2 rounded-full bg-plum px-5 py-3 text-center text-sm font-bold text-white" href="/gifts" onClick={() => setMenuOpen(false)}>
                Create a Gift
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <section id="main-content" className="px-4 py-10 sm:px-6 md:py-14 lg:px-8 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 w-fit rounded-full border border-rose/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose">
              Love Across Miles
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[1] text-ink text-balance sm:text-6xl lg:text-7xl">
              Gifts made personal, even from far away.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-ink/72 sm:text-lg">
              Thoughtful flowers, chocolates, keepsakes, and custom details shaped into a gift request Krivya can review with care.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="focus-ring rounded-full bg-plum px-7 py-4 text-center text-base font-bold text-white shadow-soft transition hover:bg-rose" href="/gifts">
                Create a Gift
              </Link>
              <a className="focus-ring rounded-full border border-plum/20 bg-white/70 px-7 py-4 text-center text-base font-bold text-plum transition hover:bg-white" href="#creations">
                View Creations
              </a>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] bg-white shadow-soft sm:min-h-[560px]">
            <Image
              src="/images/1.jpeg"
              alt="Completed Krivya hamper with roses, teddy bear, chocolates, and a personal keepsake"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 92vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="occasions" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-rose">Shop by occasion</p>
              <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">Find a gift for the moment.</h2>
            </div>
            <Link className="focus-ring w-fit rounded-full border border-plum/20 bg-white/72 px-5 py-3 text-sm font-black text-plum transition hover:bg-white" href="/gifts">
              Explore Gifts
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {occasions.map((occasion) => (
              <Link key={occasion.name} href="/gifts" className="focus-ring group overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={occasion.image} alt={`${occasion.name} Krivya gift inspiration`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-black text-ink sm:text-lg">{occasion.name}</h3>
                  <p className="mt-1 text-sm leading-5 text-ink/62">{occasion.note}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="creations" className="bg-ink px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-ribbon">Krivya Creations</p>
              <h2 className="font-serif text-3xl font-bold text-balance sm:text-4xl">Made to feel personal.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-white/68">Use these as inspiration. Availability and final details are confirmed with Krivya.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-2xl bg-white/8 ring-1 ring-white/12">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={item.image} alt={`${item.title} by Krivya`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-black">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
          <Link className="focus-ring mt-8 inline-flex rounded-full bg-ribbon px-6 py-3 text-sm font-black text-ink transition hover:bg-white" href="/gifts">
            Explore Gifts
          </Link>
        </div>
      </section>

      <section id="personalize" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-rose">Personalize</p>
            <h2 className="font-serif text-3xl font-bold text-ink text-balance sm:text-4xl">Small details make the gift feel like theirs.</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-ink/68">
              Add direction for photos, messages, flowers, chocolates, keepsakes, and finishing touches before sending one Request ID to Krivya.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {personalTouches.map((touch) => (
              <figure key={touch.label} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative aspect-square">
                  <Image src={touch.image} alt={`Krivya ${touch.label.toLowerCase()} inspiration`} fill sizes="(min-width: 1024px) 10vw, 20vw" className="object-cover" />
                </div>
                <figcaption className="px-2 py-2 text-center text-xs font-black text-ink sm:text-sm">{touch.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 max-w-2xl">
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-rose">How it works</p>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">From gift idea to Request ID.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Choose your gifts", "Browse the Gift Store and add the pieces that feel right."],
              ["Add the personal details", "Tell Krivya where it is going and how it should feel."],
              ["Send your Request ID", "Continue on WhatsApp with one clear code for Krivya to review."],
            ].map(([title, copy], index) => (
              <article key={title} className="rounded-2xl border border-plum/10 bg-white/74 p-5 shadow-sm">
                <span className="grid size-10 place-items-center rounded-full bg-plum font-serif text-lg font-bold text-white">{index + 1}</span>
                <h3 className="mt-5 text-xl font-black text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/66">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-plum px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-[0.75fr_1.25fr] md:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-ribbon">Destinations</p>
            <h2 className="font-serif text-3xl font-bold text-balance sm:text-4xl">Gifts shaped for people across miles.</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {deliveryDestinations.map((country) => (
              <div key={country} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15">
                <p className="font-black">{country}</p>
                <p className="mt-2 text-xs leading-5 text-white/68">Availability and delivery details are confirmed with Krivya.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] bg-white p-7 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose">Love Across Miles</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">Ready to make it personal?</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="focus-ring rounded-full bg-plum px-7 py-4 text-center text-base font-black text-white transition hover:bg-rose" href="/gifts">
              Create a Gift
            </Link>
            <a className="focus-ring rounded-full border border-plum/20 px-7 py-4 text-center text-base font-black text-plum transition hover:bg-petal" href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp Krivya
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-plum/10 bg-white/80 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-ink/68 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-3xl font-bold text-plum">Krivya</p>
            <p className="mt-2">Love Across Miles. Concept website redesign for demonstration purposes.</p>
          </div>
          <div className="flex flex-wrap gap-4 font-bold text-ink">
            <Link className="focus-ring rounded-sm hover:text-plum" href="/gifts">
              Gifts
            </Link>
            <a className="focus-ring rounded-sm hover:text-plum" href="#occasions">
              Occasions
            </a>
            <a className="focus-ring rounded-sm hover:text-plum" href="#how-it-works">
              How It Works
            </a>
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
