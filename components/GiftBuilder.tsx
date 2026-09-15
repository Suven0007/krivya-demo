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

const categoryFilters = ["All", "Flowers", "Chocolates", "Teddy Bears", "Personalized Gifts", "Keepsakes", "Fragrance", "Gift Boxes"] as const;
type StoreCategory = (typeof categoryFilters)[number];
type BuilderStep = "shop" | "details" | "review" | "success";

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

function isValidDeliveryDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getStoreCategory(item: GiftItem): StoreCategory {
  if (item.category === "Perfume") {
    return "Fragrance";
  }

  if (item.category === "Photo Frames" || item.category === "Personalized Mugs") {
    return "Personalized Gifts";
  }

  if (item.category === "Message Bottles" || item.category === "Accessories" || item.category === "Other Inspiration") {
    return "Keepsakes";
  }

  if (item.category === "Flowers" || item.category === "Chocolates" || item.category === "Teddy Bears" || item.category === "Gift Boxes") {
    return item.category;
  }

  return "Keepsakes";
}

export function GiftBuilder() {
  const [activeCategory, setActiveCategory] = useState<StoreCategory>("All");
  const [step, setStep] = useState<BuilderStep>("shop");
  const [basket, setBasket] = useState<GiftBasketItem[]>([]);
  const [details, setDetails] = useState<CustomerDetails>(initialDetails);
  const [submittedRequest, setSubmittedRequest] = useState<GiftRequest | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setBasket(loadBasket());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveBasket(basket);
  }, [basket]);

  useEffect(() => {
    if (!lastAdded) {
      return;
    }

    const timer = window.setTimeout(() => setLastAdded(""), 2200);
    return () => window.clearTimeout(timer);
  }, [lastAdded]);

  const itemCount = useMemo(() => basket.reduce((total, entry) => total + entry.quantity, 0), [basket]);
  const filteredCatalog = useMemo(
    () => (activeCategory === "All" ? giftCatalog : giftCatalog.filter((item) => getStoreCategory(item) === activeCategory)),
    [activeCategory],
  );

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
    setLastAdded(item.name);
  }

  function updateQuantity(itemId: string, quantity: number) {
    setBasket((current) =>
      quantity < 1
        ? current.filter((entry) => entry.item.id !== itemId)
        : current.map((entry) => (entry.item.id === itemId ? { ...entry, quantity } : entry)),
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
    if (basket.length === 0) {
      nextErrors.push("Add at least one gift item.");
    }
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
    if (details.preferredDeliveryDate && !isValidDeliveryDate(details.preferredDeliveryDate)) {
      nextErrors.push("Choose a valid preferred delivery date.");
    }
    if (details.preferredDeliveryDate && isValidDeliveryDate(details.preferredDeliveryDate) && details.preferredDeliveryDate < todayIsoDate()) {
      nextErrors.push("Preferred delivery date cannot be in the past.");
    }

    return nextErrors;
  }

  function startDetails() {
    setErrors([]);
    if (basket.length === 0) {
      setBasketOpen(true);
      return;
    }

    setBasketOpen(false);
    setStep("details");
  }

  function proceedToReview() {
    const nextErrors = validateRequest();
    setErrors(nextErrors);

    if (nextErrors.length === 0) {
      setStep("review");
      setBasketOpen(false);
    } else {
      setStep("details");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRequest();
    setErrors(nextErrors);

    if (nextErrors.length > 0) {
      setStep("details");
      return;
    }

    const request = localRequestRepository.createRequest({
      customer: { ...details, budget: "" },
      items: basket,
    });

    setSubmittedRequest(request);
    setBasket([]);
    saveBasket([]);
    setStep("success");
  }

  return (
    <section id="create-gift" className="px-4 pb-24 pt-10 text-white sm:px-6 sm:pt-14 lg:px-8 lg:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-ribbon">Gift Store</p>
            <h1 className="font-serif text-4xl font-bold text-balance sm:text-5xl">Build Your Gift.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Choose the pieces that make it theirs, then add delivery and personalization details before sending one Request ID to Krivya.
            </p>
          </div>
          <button
            type="button"
            className="focus-ring flex items-center justify-between gap-4 rounded-3xl bg-white/8 p-5 text-left ring-1 ring-white/12 transition hover:bg-white/12"
            onClick={() => setBasketOpen(true)}
          >
            <span>
              <span className="block text-sm font-bold uppercase tracking-[0.18em] text-ribbon">Your Gift</span>
              <span className="mt-2 block text-sm leading-6 text-white/70">Open your basket, adjust quantities, then continue to request details.</span>
            </span>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ribbon text-lg font-black text-ink">{itemCount}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {step === "shop" ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0">
                <div className="mb-5 flex max-w-full gap-2 overflow-x-auto pb-2" aria-label="Gift categories">
                  {categoryFilters.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`focus-ring shrink-0 rounded-full px-4 py-2.5 text-xs font-black transition sm:text-sm ${
                        activeCategory === category ? "bg-ribbon text-ink" : "bg-white/10 text-white hover:bg-white/18"
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {lastAdded ? (
                  <div className="mb-5 rounded-2xl bg-ribbon px-5 py-4 text-sm font-black text-ink" role="status">
                    Added {lastAdded} to your gift.
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {filteredCatalog.map((item, index) => {
                    const basketEntry = basket.find((entry) => entry.item.id === item.id);
                    const wasJustAdded = lastAdded === item.name;

                    return (
                      <article key={item.id} className="group min-w-0 overflow-hidden rounded-2xl bg-white text-ink shadow-soft">
                        <div className="relative aspect-square overflow-hidden bg-petal">
                          <Image
                            src={item.imagePath}
                            alt={item.name}
                            fill
                            sizes="(min-width: 1280px) 18vw, (min-width: 768px) 30vw, 46vw"
                            priority={index < 2}
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0 p-3 sm:p-4">
                          <p className="truncate text-[0.65rem] font-black uppercase tracking-[0.12em] text-rose sm:text-xs">{getStoreCategory(item)}</p>
                          <h3 className="mt-1 min-h-10 text-sm font-black leading-5 sm:text-base">{item.name}</h3>
                          <div className="mt-3 flex min-w-0 items-center gap-2">
                            <button type="button" className="focus-ring min-h-10 min-w-0 flex-1 rounded-full bg-plum px-3 py-2 text-xs font-black text-white transition hover:bg-rose sm:px-4 sm:text-sm" onClick={() => addItem(item)}>
                              {wasJustAdded ? "Added ✓" : "Add to Gift"}
                            </button>
                            {basketEntry ? <span className="shrink-0 rounded-full bg-petal px-2.5 py-1.5 text-xs font-black text-plum">x{basketEntry.quantity}</span> : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <BasketPanel basket={basket} itemCount={itemCount} open={basketOpen} onClose={() => setBasketOpen(false)} onClear={clearBasket} onRemove={removeItem} onQuantity={updateQuantity} onContinue={startDetails} />
            </div>
          ) : null}

          {step === "details" ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <section className="rounded-[2rem] bg-white p-5 text-ink shadow-soft sm:p-8">
                <ProgressPills active="details" />
                <div className="mt-6">
                  <h3 className="font-serif text-3xl font-bold">Tell Krivya where it is going.</h3>
                  <p className="mt-3 text-base leading-7 text-ink/68">A few details help Krivya confirm availability, timing, and personalization.</p>
                </div>

                {errors.length > 0 ? <ErrorList errors={errors} /> : null}

                <div className="mt-7 grid gap-6">
                  <fieldset className="grid gap-3">
                    <legend className="text-sm font-black uppercase tracking-[0.16em] text-rose">Delivery</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {deliveryDestinations.map((destination) => (
                        <button
                          key={destination}
                          type="button"
                          className={`focus-ring rounded-2xl border p-4 text-left text-base font-black transition ${
                            details.destination === destination ? "border-plum bg-petal text-plum" : "border-plum/12 bg-white hover:border-plum/45"
                          }`}
                          onClick={() => updateDetails("destination", destination as DeliveryDestination)}
                        >
                          {destination}
                        </button>
                      ))}
                    </div>
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
                  </fieldset>

                  <fieldset className="grid gap-3">
                    <legend className="text-sm font-black uppercase tracking-[0.16em] text-rose">Occasion</legend>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {giftOccasions.map((occasion) => (
                        <button
                          key={occasion}
                          type="button"
                          className={`focus-ring rounded-2xl border p-4 text-left text-base font-black transition ${
                            details.occasion === occasion ? "border-plum bg-petal text-plum" : "border-plum/12 bg-white hover:border-plum/45"
                          }`}
                          onClick={() => updateDetails("occasion", occasion as GiftOccasion)}
                        >
                          {occasion}
                        </button>
                      ))}
                    </div>
                    <TextField label="Recipient / who the gift is for" value={details.recipient} onChange={(value) => updateDetails("recipient", value)} required />
                  </fieldset>

                  <fieldset className="grid gap-5 sm:grid-cols-2">
                    <legend className="text-sm font-black uppercase tracking-[0.16em] text-rose sm:col-span-2">Customer</legend>
                    <TextField label="Customer name" value={details.customerName} onChange={(value) => updateDetails("customerName", value)} required />
                    <TextField label="Phone or WhatsApp number" value={details.phone} onChange={(value) => updateDetails("phone", value)} required />
                    <TextField label="Email optional" value={details.email ?? ""} onChange={(value) => updateDetails("email", value)} type="email" />
                  </fieldset>

                  <fieldset className="grid gap-5">
                    <legend className="text-sm font-black uppercase tracking-[0.16em] text-rose">Personalization</legend>
                    <TextArea label="Personalization details" value={details.personalizationNotes} onChange={(value) => updateDetails("personalizationNotes", value)} placeholder="Colors, photos, names, theme, or special details." />
                    <TextArea label="Gift message / card message" value={details.giftMessage} onChange={(value) => updateDetails("giftMessage", value)} placeholder="Message Krivya should include on the card." />
                    <TextArea label="Additional notes" value={details.additionalNotes} onChange={(value) => updateDetails("additionalNotes", value)} placeholder="Delivery notes, recipient preferences, substitutions, or timing context." />
                  </fieldset>
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-plum/10 pt-6 sm:flex-row sm:justify-between">
                  <button type="button" className="focus-ring rounded-full border border-plum/20 px-6 py-4 text-base font-black text-plum transition hover:bg-petal" onClick={() => setStep("shop")}>
                    Back to Store
                  </button>
                  <button type="button" className="focus-ring rounded-full bg-plum px-6 py-4 text-base font-black text-white transition hover:bg-rose" onClick={proceedToReview}>
                    Review Gift
                  </button>
                </div>
              </section>

              <BasketPanel basket={basket} itemCount={itemCount} open={basketOpen} onClose={() => setBasketOpen(false)} onClear={clearBasket} onRemove={removeItem} onQuantity={updateQuantity} onContinue={proceedToReview} compact />
            </div>
          ) : null}

          {step === "review" ? (
            <section className="rounded-[2rem] bg-white p-5 text-ink shadow-soft sm:p-8">
              <ProgressPills active="review" />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-serif text-3xl font-bold">Review Your Gift</h3>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-ink/68">Confirm the items and details before creating the Request ID.</p>
                </div>
                <button type="button" className="focus-ring rounded-full border border-plum/20 px-5 py-3 text-sm font-black text-plum" onClick={() => setStep("details")}>
                  Edit details
                </button>
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                <section className="rounded-2xl border border-plum/10 bg-petal p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">Your Gift</p>
                  <GiftItemsList items={basket} />
                  <p className="mt-4 text-sm font-semibold leading-6 text-ink/62">Final availability and pricing will be confirmed by Krivya.</p>
                </section>

                <section className="rounded-2xl border border-plum/10 bg-white p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">Request details</p>
                  <div className="mt-4 grid gap-3">
                    <ReviewRow label="Destination" value={details.destination} />
                    <ReviewRow label="Preferred date" value={details.preferredDeliveryDate} />
                    <ReviewRow label="Occasion" value={details.occasion} />
                    <ReviewRow label="Recipient" value={details.recipient} />
                    <ReviewRow label="Customer" value={details.customerName} />
                    <ReviewRow label="Phone / WhatsApp" value={details.phone} />
                    <ReviewRow label="Email" value={details.email || "Not provided"} />
                    <ReviewRow label="Personalization" value={details.personalizationNotes || "Not provided"} />
                    <ReviewRow label="Gift message" value={details.giftMessage || "Not provided"} />
                    <ReviewRow label="Additional notes" value={details.additionalNotes || "Not provided"} />
                  </div>
                </section>
              </div>

              <div className="mt-8 flex flex-col gap-3 border-t border-plum/10 pt-6 sm:flex-row sm:justify-between">
                <button type="button" className="focus-ring rounded-full border border-plum/20 px-6 py-4 text-base font-black text-plum transition hover:bg-petal" onClick={() => setStep("details")}>
                  Back
                </button>
                <button type="submit" className="focus-ring rounded-full bg-plum px-6 py-4 text-base font-black text-white transition hover:bg-rose">
                  Create Gift Request
                </button>
              </div>
            </section>
          ) : null}

          {step === "success" && submittedRequest ? (
            <section className="rounded-[2rem] bg-white p-6 text-center text-ink shadow-soft sm:p-10">
              <ProgressPills active="success" />
              <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-rose">Your gift request is ready.</p>
              <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-ink/55">Gift Request ID</p>
              <h3 className="mt-2 font-serif text-4xl font-bold text-plum sm:text-5xl">{submittedRequest.requestCode}</h3>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-ink/70">Continue to WhatsApp and send your Request ID to Krivya.</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a className="focus-ring rounded-full bg-plum px-6 py-4 text-base font-black text-white transition hover:bg-rose" href={buildKrivyaRequestWhatsAppUrl(submittedRequest.requestCode)} target="_blank" rel="noreferrer">
                  Continue on WhatsApp
                </a>
                <Link className="focus-ring rounded-full border border-plum/20 px-6 py-4 text-base font-black text-plum transition hover:bg-petal" href={`/request/${submittedRequest.requestCode}`}>
                  View Your Request
                </Link>
              </div>
            </section>
          ) : null}
        </form>
        <div className="h-20 lg:hidden" aria-hidden="true" />
      </div>

      <button
        type="button"
        className="focus-ring fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 right-4 z-30 flex items-center justify-between gap-3 rounded-full bg-ribbon px-4 py-3 text-sm font-black text-ink shadow-soft lg:hidden"
        onClick={() => setBasketOpen(true)}
        aria-label={`Open your gift basket with ${itemCount} items`}
      >
        <span>Your Gift · {itemCount}</span>
        <span className="shrink-0">View Basket →</span>
      </button>
    </section>
  );
}

function ProgressPills({ active }: { active: BuilderStep }) {
  const steps: Array<{ id: BuilderStep; label: string }> = [
    { id: "shop", label: "Your Gift" },
    { id: "details", label: "Delivery" },
    { id: "review", label: "Review" },
    { id: "success", label: "Request ID" },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2" aria-label="Gift request progress">
      {steps.map((item, index) => (
        <span key={item.id} className={`min-w-fit rounded-full px-4 py-3 text-sm font-black ${active === item.id ? "bg-plum text-white" : "bg-petal text-ink/65"}`}>
          {index + 1}. {item.label}
        </span>
      ))}
    </div>
  );
}

function ErrorList({ errors }: { errors: string[] }) {
  return (
    <div className="mt-5 rounded-2xl border border-rose/25 bg-rose/8 p-4" role="alert">
      <p className="font-black text-rose">Please check:</p>
      <ul className="mt-2 grid gap-1 text-sm text-ink/75">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
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

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-petal px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-ink/75">{value}</p>
    </div>
  );
}

function GiftItemsList({ items }: { items: GiftBasketItem[] }) {
  return (
    <div className="mt-4 grid gap-3">
      {items.map((entry) => (
        <article key={entry.item.id} className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-white p-3">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-petal">
            <Image src={entry.item.imagePath} alt="" fill sizes="72px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{getStoreCategory(entry.item)}</p>
            <h4 className="mt-1 text-sm font-black">{entry.item.name}</h4>
            <p className="mt-1 text-xs leading-5 text-ink/55">{entry.item.description}</p>
          </div>
          <p className="rounded-full bg-petal px-3 py-1 text-sm font-black">x{entry.quantity}</p>
        </article>
      ))}
    </div>
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
  onContinue,
  compact = false,
}: {
  basket: GiftBasketItem[];
  itemCount: number;
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  onRemove: (itemId: string) => void;
  onQuantity: (itemId: string, quantity: number) => void;
  onContinue: () => void;
  compact?: boolean;
}) {
  return (
    <>
      {open ? <button type="button" className="fixed inset-0 z-40 bg-ink/60 lg:hidden" aria-label="Close gift basket overlay" onClick={onClose} /> : null}
      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[82vh] overflow-y-auto rounded-t-[2rem] bg-white p-5 text-ink shadow-soft transition lg:sticky lg:top-28 lg:z-auto lg:max-h-[calc(100vh-8rem)] lg:translate-y-0 lg:rounded-[2rem] lg:p-6 ${
          open ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        } ${compact && !open ? "hidden lg:block" : ""}`}
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
        <p className="mt-2 text-sm leading-6 text-ink/62">{itemCount} selected item{itemCount === 1 ? "" : "s"}</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-ink/62">Final availability and pricing will be confirmed by Krivya.</p>

        {basket.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-petal p-5">
            <p className="font-serif text-2xl font-bold text-plum">Your gift is waiting to be created.</p>
            <p className="mt-2 text-sm leading-6 text-ink/68">Choose something special to begin.</p>
            <button type="button" className="focus-ring mt-5 rounded-full bg-plum px-5 py-3 text-sm font-black text-white transition hover:bg-rose" onClick={onClose}>
              Explore Gifts
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-4">
            {basket.map((entry) => (
              <article key={entry.item.id} className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-2xl border border-plum/10 p-3">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-petal">
                  <Image src={entry.item.imagePath} alt="" fill sizes="76px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{getStoreCategory(entry.item)}</p>
                  <h4 className="mt-1 text-sm font-black">{entry.item.name}</h4>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button type="button" className="focus-ring grid size-10 place-items-center rounded-full border border-plum/20 font-black" onClick={() => onQuantity(entry.item.id, entry.quantity - 1)} aria-label={`Decrease ${entry.item.name}`}>
                      -
                    </button>
                    <span className="min-w-8 text-center text-sm font-black">{entry.quantity}</span>
                    <button type="button" className="focus-ring grid size-10 place-items-center rounded-full border border-plum/20 font-black" onClick={() => onQuantity(entry.item.id, entry.quantity + 1)} aria-label={`Increase ${entry.item.name}`}>
                      +
                    </button>
                    <button type="button" className="focus-ring rounded-full px-3 py-2 text-xs font-black text-rose underline-offset-4 hover:underline" onClick={() => onRemove(entry.item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <div className="grid gap-3">
              <button type="button" className="focus-ring rounded-full bg-plum px-5 py-4 text-sm font-black text-white transition hover:bg-rose" onClick={onContinue}>
                Continue
              </button>
              <button type="button" className="focus-ring rounded-full border border-plum/20 px-5 py-3 text-sm font-black text-plum transition hover:bg-petal" onClick={onClose}>
                Continue Shopping
              </button>
              <button type="button" className="focus-ring rounded-full px-5 py-3 text-sm font-black text-rose underline-offset-4 hover:underline" onClick={onClear}>
                Clear Gift
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
