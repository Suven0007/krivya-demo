"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

const whatsappNumber = "9779851414905";
const defaultMessage = "Hi Krivya, I'd like to create a personalized gift.";
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

const navItems = [
  { label: "Occasions", href: "#occasions" },
  { label: "Creations", href: "#creations" },
  { label: "Personalize", href: "#personalize" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Enquire", href: "#create-gift" },
];

const heroImages = [
  { src: "/images/1.jpeg", alt: "Pink Krivya hamper with roses, teddy bear, chocolates, and a photo keepsake" },
  { src: "/images/3.jpeg", alt: "Personalized Krivya gift box with chocolates, jars, flowers, and letter board" },
  { src: "/images/4.jpeg", alt: "Baby gift arrangement with balloons, plush toy, flowers, and wrapped items" },
];

const occasions = [
  { name: "Love & anniversaries", image: "/images/13.jpeg", note: "Roses, chocolates, soft toys, and small keepsakes." },
  { name: "Birthdays", image: "/images/8.jpeg", note: "Bright bouquets, snacks, frames, and cheerful plush gifts." },
  { name: "Baby welcomes", image: "/images/4.jpeg", note: "Gentle palettes, babywear, balloons, and sweet details." },
  { name: "Across miles", image: "/images/2.jpeg", note: "Warm, personal gestures for people you cannot hand-deliver to." },
];

const featured = [
  { title: "Rose Keepsake Box", image: "/images/17.jpeg", tag: "Romantic" },
  { title: "Signature Pink Hamper", image: "/images/10.jpeg", tag: "Completed hamper" },
  { title: "Premium Ribbon Set", image: "/images/5.jpeg", tag: "Elegant" },
  { title: "Soft Toy Memory Tray", image: "/images/6.jpeg", tag: "Personal" },
  { title: "Birthday Sunshine Box", image: "/images/8.jpeg", tag: "Joyful" },
  { title: "Chocolate Love Basket", image: "/images/15.jpeg", tag: "Sweet" },
];

const gallery = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/4.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
  "/images/7.jpeg",
  "/images/8.jpeg",
  "/images/9.jpeg",
  "/images/10.jpeg",
  "/images/11.jpeg",
  "/images/12.jpeg",
  "/images/13.jpeg",
  "/images/14.jpeg",
  "/images/15.jpeg",
  "/images/16.jpeg",
  "/images/17.jpeg",
  "/images/26.jpeg",
  "/images/28.jpeg",
  "/images/29.jpeg",
];

const details = [
  { label: "Photo frames", image: "/images/29.jpeg" },
  { label: "Custom mugs", image: "/images/24.jpeg" },
  { label: "Message bottles", image: "/images/26.jpeg" },
  { label: "Candles", image: "/images/28.jpeg" },
  { label: "Chocolates", image: "/images/22.jpeg" },
  { label: "Premium treats", image: "/images/23.jpeg" },
];

const countries = ["Nepal", "Australia", "Across miles"];

type GiftForm = {
  occasion: string;
  recipient: string;
  style: string;
  items: string;
  date: string;
  notes: string;
};

const initialForm: GiftForm = {
  occasion: "Birthday",
  recipient: "",
  style: "Soft romantic",
  items: "",
  date: "",
  notes: "",
};

function buildWhatsAppMessage(form: GiftForm) {
  const lines = [
    defaultMessage,
    "",
    `Occasion: ${form.occasion}`,
    form.recipient ? `Recipient: ${form.recipient}` : "",
    `Style: ${form.style}`,
    form.items ? `Preferred items: ${form.items}` : "",
    form.date ? `Needed by: ${form.date}` : "",
    form.notes ? `Notes: ${form.notes}` : "",
  ].filter(Boolean);

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<GiftForm>(initialForm);
  const giftLink = useMemo(() => buildWhatsAppMessage(form), [form]);

  function updateField(field: keyof GiftForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(giftLink, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <a
        href="#create-gift"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >
        Skip to gift enquiry
      </a>

      <div className="bg-ink px-4 py-3 text-center text-sm font-semibold text-white">
        Personalized gift concepts for thoughtful deliveries. Final production details should be confirmed directly with Krivya.
      </div>

      <header className="sticky top-0 z-40 border-b border-plum/10 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="focus-ring flex items-center gap-3 rounded-sm" aria-label="Krivya home">
            <span className="grid size-11 place-items-center rounded-full bg-plum text-lg font-black text-white">K</span>
            <span>
              <span className="block font-serif text-2xl font-bold leading-6 text-plum">Krivya</span>
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-sage">Gifts by Krivya</span>
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
            <a className="focus-ring rounded-full border border-plum/20 px-5 py-3 text-sm font-bold text-plum transition hover:bg-plum hover:text-white" href={whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="focus-ring rounded-full bg-plum px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-rose" href="#create-gift">
              Create a Gift
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
              <a className="focus-ring mt-2 rounded-full bg-plum px-5 py-3 text-center text-sm font-bold text-white" href={whatsappHref} target="_blank" rel="noreferrer">
                Message on WhatsApp
              </a>
            </div>
          </nav>
        ) : null}
      </header>

      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-5 w-fit rounded-full border border-rose/25 bg-white/75 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-rose">
              Gifts across miles
            </p>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-ink text-balance sm:text-6xl lg:text-7xl">
              Personal gifts with flowers, keepsakes, and a message that feels close.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/72">
              A premium concept website for Krivya, shaped around real hamper arrangements, romantic gestures, baby gifts, chocolates, photo memories, and custom details.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="focus-ring rounded-full bg-plum px-7 py-4 text-center text-base font-bold text-white shadow-soft transition hover:bg-rose" href="#create-gift">
                Start a gift request
              </a>
              <a className="focus-ring rounded-full border border-plum/20 bg-white/70 px-7 py-4 text-center text-base font-bold text-plum transition hover:bg-white" href="#creations">
                View creations
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-ink/70">
              {countries.map((country) => (
                <span key={country} className="rounded-full bg-white/72 px-4 py-2 shadow-sm">
                  {country}
                </span>
              ))}
            </div>
          </div>

          <div className="grid min-h-[560px] grid-cols-12 grid-rows-12 gap-4 sm:min-h-[680px]">
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

      <section className="border-y border-plum/10 bg-white/72 px-4 py-5 sm:px-6 lg:px-8" aria-label="Delivery and disclosure">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-ink/72 md:flex-row md:items-center md:justify-between">
          <p>
            <strong className="text-ink">Concept redesign disclosure:</strong> this is a website concept built from supplied Krivya imagery, not an official live-commerce guarantee.
          </p>
          <a className="focus-ring rounded-sm font-bold text-plum underline-offset-4 hover:underline" href={whatsappHref} target="_blank" rel="noreferrer">
            Confirm availability on WhatsApp
          </a>
        </div>
      </section>

      <section id="occasions" className="section-pad px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose">Gift by occasion</p>
            <h2 className="font-serif text-4xl font-bold text-ink text-balance sm:text-5xl">Choose the feeling first. Build the box around it.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {occasions.map((occasion) => (
              <article key={occasion.name} className="group overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={occasion.image} alt={`${occasion.name} Krivya gift example`} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
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
              <h2 className="font-serif text-4xl font-bold text-balance sm:text-5xl">Finished hampers take the lead.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-white/70">
              The strongest supplied arrangements are used as the site’s hero collection because they show the full Krivya experience.
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

      <section id="personalize" className="section-pad px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose">Personalization</p>
            <h2 className="font-serif text-4xl font-bold text-ink text-balance sm:text-5xl">Layer the small things that make the gift unmistakably theirs.</h2>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              Photos, handwritten notes, mugs, candles, chocolates, message bottles, flowers, and soft toys can all become part of a custom brief.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {details.map((detail) => (
              <figure key={detail.label} className="overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="relative aspect-square">
                  <Image src={detail.image} alt={`Krivya ${detail.label.toLowerCase()} option`} fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 30vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="px-4 py-3 text-sm font-black text-ink">{detail.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-white/72 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] shadow-soft">
            <Image src="/images/16.jpeg" alt="Krivya gift with a personal card, teddy bear, mug, and photo frame" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose">Brand story</p>
            <h2 className="font-serif text-4xl font-bold text-ink text-balance sm:text-5xl">For distance, celebration, apology, surprise, and everyday love.</h2>
            <p className="mt-5 text-lg leading-8 text-ink/70">
              Krivya’s supplied imagery shows a clear emotional signature: tactile boxes, rich florals, photographed memories, handwritten cards, and treats chosen to feel intimate rather than generic.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section-pad px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-rose">How it works</p>
            <h2 className="font-serif text-4xl font-bold text-ink sm:text-5xl">A simple path from idea to gift brief.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              ["Share the moment", "Tell Krivya the occasion, recipient, delivery window, and the emotion you want the gift to carry."],
              ["Choose the ingredients", "Pick flowers, chocolates, keepsakes, soft toys, photos, candles, or a fully guided Krivya arrangement."],
              ["Confirm the details", "Finalize availability, delivery feasibility, personalization, and budget directly with Krivya before production."],
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
          <div className="grid gap-3 sm:grid-cols-3">
            {countries.map((country) => (
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
              <h2 id="gallery-title" className="font-serif text-4xl font-bold text-ink sm:text-5xl">A fuller look at the Krivya image set.</h2>
            </div>
            <p className="max-w-md text-base leading-7 text-ink/68">
              Completed arrangements are prioritized, with product details included where they help explain personalization.
            </p>
          </div>
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-4">
            {gallery.map((src, index) => (
              <figure key={src} className="mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-soft">
                <Image src={src} alt={`Krivya gift gallery image ${index + 1}`} width={700} height={920} className="h-auto w-full object-cover" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="create-gift" className="section-pad bg-ink px-4 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-ribbon">Create a Gift</p>
            <h2 className="font-serif text-4xl font-bold text-balance sm:text-5xl">Turn a few details into a WhatsApp gift brief.</h2>
            <p className="mt-5 text-lg leading-8 text-white/70">
              This enquiry flow does not collect payment or guarantee pricing. It prepares a clear message so Krivya can confirm options directly.
            </p>
            <a className="focus-ring mt-8 inline-flex rounded-full bg-ribbon px-6 py-4 text-base font-black text-ink transition hover:bg-white" href={whatsappHref} target="_blank" rel="noreferrer">
              Send the default message
            </a>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 text-ink shadow-soft sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-black">
                Occasion
                <select className="focus-ring rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold" value={form.occasion} onChange={(event) => updateField("occasion", event.target.value)}>
                  <option>Birthday</option>
                  <option>Anniversary</option>
                  <option>Valentine&apos;s Day</option>
                  <option>Baby gift</option>
                  <option>Thank you</option>
                  <option>Custom occasion</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Recipient name
                <input className="focus-ring rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold" value={form.recipient} onChange={(event) => updateField("recipient", event.target.value)} placeholder="Name or relation" />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Style
                <select className="focus-ring rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold" value={form.style} onChange={(event) => updateField("style", event.target.value)}>
                  <option>Soft romantic</option>
                  <option>Bright birthday</option>
                  <option>Elegant premium</option>
                  <option>Baby welcome</option>
                  <option>Chocolate focused</option>
                  <option>Fully guided by Krivya</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Needed by
                <input className="focus-ring rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold" type="date" value={form.date} onChange={(event) => updateField("date", event.target.value)} />
              </label>
              <label className="grid gap-2 text-sm font-black sm:col-span-2">
                Preferred items
                <input className="focus-ring rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold" value={form.items} onChange={(event) => updateField("items", event.target.value)} placeholder="Flowers, teddy, photo frame, chocolate, mug..." />
              </label>
              <label className="grid gap-2 text-sm font-black sm:col-span-2">
                Personal note
                <textarea className="focus-ring min-h-32 rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Add message text, color preferences, delivery notes, or anything meaningful." />
              </label>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="focus-ring rounded-full bg-plum px-7 py-4 text-base font-black text-white transition hover:bg-rose">
                Send enquiry on WhatsApp
              </button>
              <a className="focus-ring rounded-full border border-plum/20 px-7 py-4 text-center text-base font-black text-plum transition hover:bg-petal" href={giftLink} target="_blank" rel="noreferrer">
                Open message link
              </a>
            </div>
          </form>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] bg-white p-8 shadow-soft md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-rose">Final CTA</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">Ready to shape something personal?</h2>
          </div>
          <a className="focus-ring rounded-full bg-plum px-7 py-4 text-center text-base font-black text-white transition hover:bg-rose" href={whatsappHref} target="_blank" rel="noreferrer">
            Message Krivya
          </a>
        </div>
      </section>

      <footer className="border-t border-plum/10 bg-white/80 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-ink/68 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-serif text-3xl font-bold text-plum">Krivya</p>
            <p className="mt-2">Personalized gifts, hampers, and keepsakes. Concept website built from supplied Krivya imagery.</p>
          </div>
          <div className="flex flex-wrap gap-4 font-bold text-ink">
            {navItems.map((item) => (
              <a key={item.href} className="focus-ring rounded-sm hover:text-plum" href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
