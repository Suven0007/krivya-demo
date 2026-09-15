"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localRequestRepository } from "@/lib/requests/localRequestRepository";
import { buildKrivyaRequestWhatsAppUrl } from "@/lib/requests/whatsapp";
import type { GiftRequest } from "@/lib/requests/types";

export function RequestSummary({ requestCode }: { requestCode: string }) {
  const [request, setRequest] = useState<GiftRequest | null | undefined>(undefined);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setRequest(localRequestRepository.getRequest(requestCode));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [requestCode]);

  if (request === undefined) {
    return <Shell title="Loading request..." />;
  }

  if (!request) {
    return (
      <Shell title="Request not found">
        <p className="mt-4 max-w-xl text-lg leading-8 text-ink/70">
          This demo stores gift requests in the browser where they were created. If this Request ID was created on another device or browser, it will not appear here yet.
        </p>
        <Link className="focus-ring mt-8 inline-flex rounded-full bg-plum px-6 py-4 text-base font-black text-white" href="/gifts">
          Create a Gift Request
        </Link>
      </Shell>
    );
  }

  return (
    <Shell title="Gift Request Summary">
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rose">Gift Request ID</p>
          <h2 className="mt-3 font-serif text-4xl font-bold text-plum">{request.requestCode}</h2>
          <div className="mt-5 grid gap-3 text-sm text-ink/72">
            <SummaryRow label="Status" value={request.status} />
            <SummaryRow label="Destination" value={request.customer.destination} />
            <SummaryRow label="Occasion" value={request.customer.occasion} />
            <SummaryRow label="Preferred date" value={request.customer.preferredDeliveryDate} />
            <SummaryRow label="Created" value={new Date(request.createdAt).toLocaleString()} />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a className="focus-ring rounded-full bg-plum px-6 py-4 text-center text-base font-black text-white transition hover:bg-rose" href={buildKrivyaRequestWhatsAppUrl(request.requestCode)} target="_blank" rel="noreferrer">
              Continue on WhatsApp
            </a>
            <Link className="focus-ring rounded-full border border-plum/20 px-6 py-4 text-center text-base font-black text-plum transition hover:bg-petal" href="/gifts">
              Explore More Gifts
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-soft">
          <h3 className="font-serif text-3xl font-bold">Selected gift components</h3>
          <div className="mt-5 grid gap-3">
            {request.items.map((entry) => (
              <div key={entry.item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-plum/10 p-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">{entry.item.category}</p>
                  <p className="mt-1 font-black">{entry.item.name}</p>
                  <p className="mt-1 text-xs text-ink/52">{entry.item.id}</p>
                </div>
                <p className="rounded-full bg-petal px-3 py-1 text-sm font-black">x{entry.quantity}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-soft lg:col-span-2">
          <h3 className="font-serif text-3xl font-bold">Personal details</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SummaryRow label="Customer" value={request.customer.customerName} />
            <SummaryRow label="Phone / WhatsApp" value={request.customer.phone} />
            <SummaryRow label="Email" value={request.customer.email || "Not provided"} />
            <SummaryRow label="Recipient" value={request.customer.recipient} />
            <SummaryBlock label="Personalization" value={request.customer.personalizationNotes || "Not provided"} />
            <SummaryBlock label="Gift message" value={request.customer.giftMessage || "Not provided"} />
            <SummaryBlock label="Additional notes" value={request.customer.additionalNotes || "Not provided"} />
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Shell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link className="focus-ring inline-flex rounded-full border border-plum/20 bg-white/70 px-5 py-3 text-sm font-black text-plum" href="/">
          Back to Krivya
        </Link>
        <p className="mt-10 text-sm font-black uppercase tracking-[0.22em] text-rose">Love Across Miles</p>
        <h1 className="mt-3 font-serif text-5xl font-bold text-ink text-balance sm:text-6xl">{title}</h1>
        {children}
      </div>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-petal p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-black uppercase tracking-[0.14em] text-rose">{label}</span>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}

function SummaryBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-petal p-4 md:col-span-2">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{label}</p>
      <p className="mt-2 leading-7 text-ink/72">{value}</p>
    </div>
  );
}
