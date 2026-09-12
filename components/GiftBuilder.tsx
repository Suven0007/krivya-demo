"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { deliveryDestinations, giftCatalog, giftOccasions } from "@/lib/requests/catalog";
import { localRequestRepository } from "@/lib/requests/localRequestRepository";
import { buildKrivyaRequestWhatsAppUrl } from "@/lib/requests/whatsapp";
import type { CustomerDetails, DeliveryDestination, GiftBasketItem, GiftItem, GiftOccasion, GiftRequest } from "@/lib/requests/types";

const BASKET_STORAGE_KEY = "krivya.activeBasket.v1";
let memoryBasket: GiftBasketItem[] = [];

const initialDetails: CustomerDetails = {
  customerName: "",
  phone: "",
  email: "",
  destination: "Australia",
  occasion: "Birthday",
  recipient: "",
  preferredDeliveryDate: "",
  budget: "",
  personalizationNotes: "",
  giftMessage: "",
  additionalNotes: "",
};

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function loadBasket(): GiftBasketItem[] {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return memoryBasket;
  }

  const raw = window.localStorage.getItem(BASKET_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GiftBasketItem[]) : [];
  } catch {
    return [];
  }
}

function saveBasket(items: GiftBasketItem[]) {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    memoryBasket = items;
    return;
  }

  window.localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
}

function isValidEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, "").length >= 7;
}

export function GiftBuilder() {
  const [step, setStep] = useState(1);
  const [basket, setBasket] = useState<GiftBasketItem[]>([]);
  const [details, setDetails] = useState<CustomerDetails>(initialDetails);
  const [submittedRequest, setSubmittedRequest] = useState<GiftRequest | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBasket(loadBasket());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveBasket(basket);
  }, [basket]);

  const itemCount = useMemo(() => basket.reduce((total, entry) => total + entry.quantity, 0), [basket]);
  const selectedCategories = useMemo(() => new Set(basket.map((entry) => entry.item.category)), [basket]);

  function updateDetails<Field extends keyof CustomerDetails>(field: Field, value: CustomerDetails[Field]) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  function addItem(item: GiftItem) {
    setBasket((current) => {
      const existing = current.find((entry) => entry.item.id === item.id);
      if (existing) {
        return current.map((entry) => (entry.item.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry));
      }

      return [...current, { item, quantity: 1 }];
    });
    setBasketOpen(true);
  }

  function updateQuantity(itemId: string, quantity: number) {
    setBasket((current) =>
      current
        .map((entry) => (entry.item.id === itemId ? { ...entry, quantity: Math.max(1, quantity) } : entry))
        .filter((entry) => entry.quantity > 0),
    );
  }

  function removeItem(itemId: string) {
    setBasket((current) => current.filter((entry) => entry.item.id !== itemId));
  }

  function clearBasket() {
    setBasket([]);
  }

  function validateRequest() {
    const nextErrors: string[] = [];
    if (!details.customerName.trim()) {
      nextErrors.push("Add your name.");
    }
    if (!isValidPhone(details.phone)) {
      nextErrors.push("Add a valid phone or WhatsApp number.");
    }
    if (!isValidEmail(details.email ?? "")) {
      nextErrors.push("Use a valid email address or leave it blank.");
    }
    if (!details.recipient.trim()) {
      nextErrors.push("Add who the gift is for.");
    }
    if (!details.preferredDeliveryDate) {
      nextErrors.push("Choose a preferred delivery date.");
    }
    if (details.preferredDeliveryDate && details.preferredDeliveryDate < todayIsoDate()) {
      nextErrors.push("Preferred delivery date cannot be in the past.");
    }
    if (!details.budget.trim()) {
      nextErrors.push("Add an approximate budget.");
    }
    if (basket.length === 0) {
      nextErrors.push("Add at least one gift component.");
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRequest();
    setErrors(nextErrors);

    if (nextErrors.length > 0) {
      setStep(4);
      return;
    }

    const request = localRequestRepository.createRequest({
      customer: details,
      items: basket,
    });

    setSubmittedRequest(request);
    setBasket([]);
    saveBasket([]);
    setStep(5);
  }

  return (
    <section id="create-gift" className="section-pad bg-ink px-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-ribbon">Gift Builder</p>
            <h2 className="font-serif text-4xl font-bold text-balance sm:text-5xl">Build a complete request before WhatsApp.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
              Choose the direction, add gift inspiration, and send Krivya one clear Request ID instead of a long chat thread.
            </p>
          </div>
          <div className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/12">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ribbon">Demo storage</p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Requests are saved in this browser for the demo dashboard. A future production version should replace this with Supabase.
            </p>
          </div>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-2" aria-label="Gift builder progress">
          {["Destination", "Occasion", "Build", "Review", "Request ID"].map((label, index) => (
            <button
              key={label}
              type="button"
              className={`focus-ring min-w-fit rounded-full px-4 py-3 text-sm font-black transition ${
                step === index + 1 ? "bg-ribbon text-ink" : "bg-white/10 text-white hover:bg-white/18"
              }`}
              onClick={() => setStep(index + 1)}
              disabled={index + 1 === 5 && !submittedRequest}
            >
              {index + 1}. {label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-5 text-ink shadow-soft sm:p-8">
            {step === 1 ? (
              <div>
                <h3 className="font-serif text-3xl font-bold">Where should the gift go?</h3>
                <p className="mt-3 text-base leading-7 text-ink/68">Select the delivery market so Krivya can review availability and timing.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {deliveryDestinations.map((destination) => (
                    <button
                      key={destination}
                      type="button"
                      className={`focus-ring rounded-2xl border p-5 text-left text-lg font-black transition ${
                        details.destination === destination ? "border-plum bg-petal text-plum" : "border-plum/12 bg-white hover:border-plum/45"
                      }`}
                      onClick={() => updateDetails("destination", destination as DeliveryDestination)}
                    >
                      {destination}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <h3 className="font-serif text-3xl font-bold">What is the occasion?</h3>
                <p className="mt-3 text-base leading-7 text-ink/68">This helps Krivya guide the colors, components, and card message tone.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {giftOccasions.map((occasion) => (
                    <button
                      key={occasion}
                      type="button"
                      className={`focus-ring rounded-2xl border p-5 text-left text-lg font-black transition ${
                        details.occasion === occasion ? "border-plum bg-petal text-plum" : "border-plum/12 bg-white hover:border-plum/45"
                      }`}
                      onClick={() => updateDetails("occasion", occasion as GiftOccasion)}
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h3 className="font-serif text-3xl font-bold">Add gift inspiration.</h3>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-ink/68">
                      These are components and direction, not fixed products or guaranteed stock.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="focus-ring rounded-full border border-plum/20 px-5 py-3 text-sm font-black text-plum lg:hidden"
                    onClick={() => setBasketOpen(true)}
                  >
                    Gift Basket ({itemCount})
                  </button>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {giftCatalog.map((item) => (
                    <article key={item.id} className="overflow-hidden rounded-2xl border border-plum/10 bg-white shadow-sm">
                      <div className="relative aspect-[4/3]">
                        <Image src={item.imagePath} alt={item.name} fill sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 90vw" className="object-cover" />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">{item.category}</p>
                        <h4 className="mt-2 text-lg font-black">{item.name}</h4>
                        <p className="mt-2 text-sm leading-6 text-ink/64">{item.description}</p>
                        <button
                          type="button"
                          className="focus-ring mt-4 w-full rounded-full bg-plum px-4 py-3 text-sm font-black text-white transition hover:bg-rose"
                          onClick={() => addItem(item)}
                        >
                          {selectedCategories.has(item.category) ? "Add another" : "Add to Gift"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <h3 className="font-serif text-3xl font-bold">Add request details.</h3>
                <p className="mt-3 text-base leading-7 text-ink/68">Krivya gets the useful context first, then confirms availability by WhatsApp.</p>
                {errors.length > 0 ? (
                  <div className="mt-5 rounded-2xl border border-rose/25 bg-rose/8 p-4" role="alert">
                    <p className="font-black text-rose">Please check:</p>
                    <ul className="mt-2 grid gap-1 text-sm text-ink/75">
                      {errors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <TextField label="Customer name" value={details.customerName} onChange={(value) => updateDetails("customerName", value)} required />
                  <TextField label="Phone or WhatsApp number" value={details.phone} onChange={(value) => updateDetails("phone", value)} required />
                  <TextField label="Email optional" value={details.email ?? ""} onChange={(value) => updateDetails("email", value)} type="email" />
                  <TextField label="Recipient / who the gift is for" value={details.recipient} onChange={(value) => updateDetails("recipient", value)} required />
                  <label className="grid gap-2 text-sm font-black">
                    Preferred delivery date
                    <input
                      className="focus-ring rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold"
                      type="date"
                      min={todayIsoDate()}
                      value={details.preferredDeliveryDate}
                      onChange={(event) => updateDetails("preferredDeliveryDate", event.target.value)}
                      required
                    />
                  </label>
                  <TextField label="Approximate budget" value={details.budget} onChange={(value) => updateDetails("budget", value)} placeholder="Example: NPR 8,000 or AUD 120" required />
                  <TextArea label="Personalization notes" value={details.personalizationNotes} onChange={(value) => updateDetails("personalizationNotes", value)} placeholder="Colors, photos, names, theme, or special details." />
                  <TextArea label="Gift message / card message" value={details.giftMessage} onChange={(value) => updateDetails("giftMessage", value)} placeholder="Message Krivya should include on the card." />
                  <label className="grid gap-2 text-sm font-black sm:col-span-2">
                    Additional notes
                    <textarea
                      className="focus-ring min-h-28 rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold"
                      value={details.additionalNotes}
                      onChange={(event) => updateDetails("additionalNotes", event.target.value)}
                      placeholder="Delivery notes, recipient preferences, substitutions, or timing context."
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {step === 5 && submittedRequest ? (
              <div className="rounded-[1.5rem] bg-petal p-6 text-center">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-rose">Your gift request is ready.</p>
                <h3 className="mt-4 font-serif text-4xl font-bold text-plum">{submittedRequest.requestCode}</h3>
                <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink/70">
                  Continue to WhatsApp and send your Request ID to Krivya. They can review your gift details and confirm availability.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <a className="focus-ring rounded-full bg-plum px-6 py-4 text-base font-black text-white transition hover:bg-rose" href={buildKrivyaRequestWhatsAppUrl(submittedRequest.requestCode)} target="_blank" rel="noreferrer">
                    Continue on WhatsApp
                  </a>
                  <Link className="focus-ring rounded-full border border-plum/20 px-6 py-4 text-base font-black text-plum transition hover:bg-white" href={`/request/${submittedRequest.requestCode}`}>
                    View Request
                  </Link>
                </div>
              </div>
            ) : null}

            {step < 5 ? (
              <div className="mt-8 flex flex-col gap-3 border-t border-plum/10 pt-6 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  className="focus-ring rounded-full border border-plum/20 px-6 py-4 text-base font-black text-plum transition hover:bg-petal disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={() => setStep((current) => Math.max(1, current - 1))}
                  disabled={step === 1}
                >
                  Back
                </button>
                {step < 4 ? (
                  <button type="button" className="focus-ring rounded-full bg-plum px-6 py-4 text-base font-black text-white transition hover:bg-rose" onClick={() => setStep((current) => current + 1)}>
                    Continue
                  </button>
                ) : (
                  <button type="submit" className="focus-ring rounded-full bg-plum px-6 py-4 text-base font-black text-white transition hover:bg-rose">
                    Send Gift Request
                  </button>
                )}
              </div>
            ) : null}
          </form>

          <BasketPanel
            basket={basket}
            itemCount={itemCount}
            open={basketOpen}
            onClose={() => setBasketOpen(false)}
            onClear={clearBasket}
            onRemove={removeItem}
            onQuantity={updateQuantity}
          />
        </div>
      </div>

      <button
        type="button"
        className="focus-ring fixed bottom-4 left-4 right-4 z-30 rounded-full bg-ribbon px-5 py-4 text-sm font-black text-ink shadow-soft lg:hidden"
        onClick={() => setBasketOpen(true)}
        aria-label={`Open gift basket with ${itemCount} items`}
      >
        Gift Basket ({itemCount}) · Review Gift
      </button>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-black">
      {label}
      <input
        className="focus-ring rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-black">
      {label}
      <textarea
        className="focus-ring min-h-32 rounded-2xl border border-plum/15 bg-petal px-4 py-3 text-base font-semibold"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function BasketPanel({
  basket,
  itemCount,
  open,
  onClose,
  onClear,
  onRemove,
  onQuantity,
}: {
  basket: GiftBasketItem[];
  itemCount: number;
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  onRemove: (itemId: string) => void;
  onQuantity: (itemId: string, quantity: number) => void;
}) {
  return (
    <>
      {open ? <button type="button" className="fixed inset-0 z-40 bg-ink/60 lg:hidden" aria-label="Close gift basket overlay" onClick={onClose} /> : null}
      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[82vh] overflow-y-auto rounded-t-[2rem] bg-white p-5 text-ink shadow-soft transition lg:sticky lg:top-28 lg:z-auto lg:max-h-[calc(100vh-8rem)] lg:rounded-[2rem] lg:p-6 ${
          open ? "translate-y-0" : "translate-y-[calc(100%-5rem)] lg:translate-y-0"
        }`}
        aria-label="Gift Basket"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-rose">Your Gift</p>
            <h3 className="font-serif text-3xl font-bold">Gift Basket</h3>
          </div>
          <button type="button" className="focus-ring rounded-full border border-plum/20 px-4 py-2 text-sm font-black text-plum lg:hidden" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="mt-2 text-sm leading-6 text-ink/62">{itemCount} selected component{itemCount === 1 ? "" : "s"}</p>

        {basket.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-petal p-5 text-sm leading-6 text-ink/68">Add flowers, chocolates, keepsakes, or other inspiration to prepare a clearer request.</div>
        ) : (
          <div className="mt-5 grid gap-4">
            {basket.map((entry) => (
              <article key={entry.item.id} className="grid grid-cols-[76px_1fr] gap-3 rounded-2xl border border-plum/10 p-3">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-petal">
                  <Image src={entry.item.imagePath} alt="" fill sizes="76px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{entry.item.category}</p>
                  <h4 className="mt-1 text-sm font-black">{entry.item.name}</h4>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button type="button" className="focus-ring grid size-9 place-items-center rounded-full border border-plum/20 font-black" onClick={() => onQuantity(entry.item.id, entry.quantity - 1)} aria-label={`Decrease ${entry.item.name}`}>
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-black">{entry.quantity}</span>
                    <button type="button" className="focus-ring grid size-9 place-items-center rounded-full border border-plum/20 font-black" onClick={() => onQuantity(entry.item.id, entry.quantity + 1)} aria-label={`Increase ${entry.item.name}`}>
                      +
                    </button>
                    <button type="button" className="focus-ring rounded-full px-3 py-2 text-xs font-black text-rose underline-offset-4 hover:underline" onClick={() => onRemove(entry.item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <button type="button" className="focus-ring rounded-full border border-plum/20 px-4 py-3 text-sm font-black text-plum transition hover:bg-petal" onClick={onClear}>
              Clear basket
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
