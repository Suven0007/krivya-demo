"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { giftCatalog } from "@/lib/requests/catalog";
import { localRequestRepository } from "@/lib/requests/localRequestRepository";
import { buildCustomerWhatsAppUrl } from "@/lib/requests/whatsapp";
import type { GiftRequest, GiftRequestStatus } from "@/lib/requests/types";

const statuses: Array<GiftRequestStatus | "All"> = ["All", "New", "Reviewing", "Contacted", "Confirmed", "Completed", "Cancelled"];
const overviewStatuses: GiftRequestStatus[] = ["New", "Reviewing", "Contacted", "Confirmed", "Completed"];
const demoMarker = "Demo Request";

export function AdminDashboard() {
  const [requests, setRequests] = useState<GiftRequest[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<GiftRequestStatus | "All">("All");
  const [selectedCode, setSelectedCode] = useState<string>("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const loaded = localRequestRepository.listRequests();
      setRequests(loaded);
      setSelectedCode((current) => current || loaded[0]?.requestCode || "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesStatus = status === "All" || request.status === status;
      const matchesQuery =
        !needle ||
        request.requestCode.toLowerCase().includes(needle) ||
        request.customer.customerName.toLowerCase().includes(needle) ||
        request.customer.destination.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [query, requests, status]);

  const selectedRequest = filtered.find((request) => request.requestCode === selectedCode) ?? filtered[0] ?? null;
  const overviewCounts = useMemo(
    () =>
      overviewStatuses.map((item) => ({
        status: item,
        count: requests.filter((request) => request.status === item).length,
      })),
    [requests],
  );

  function refresh() {
    setRequests(localRequestRepository.listRequests());
  }

  function updateStatus(requestCode: string, nextStatus: GiftRequestStatus) {
    localRequestRepository.updateStatus(requestCode, nextStatus);
    refresh();
  }

  function loadDemoRequest() {
    const currentRequests = localRequestRepository.listRequests();
    const existingDemo = currentRequests.find((request) => request.customer.additionalNotes.includes(demoMarker) || request.customer.customerName === demoMarker);

    if (existingDemo) {
      setRequests(currentRequests);
      setSelectedCode(existingDemo.requestCode);
      return;
    }

    const request = localRequestRepository.createRequest({
      customer: {
        customerName: demoMarker,
        phone: "+9779851414905",
        email: "demo@example.com",
        destination: "Australia",
        occasion: "Birthday",
        recipient: "Sample recipient",
        preferredDeliveryDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
        budget: "",
        personalizationNotes: "Soft colors, personal photo, and a handwritten note.",
        giftMessage: "Love across miles.",
        additionalNotes: "Demo Request: sample data for sales presentation only.",
      },
      items: [
        { item: giftCatalog[0], quantity: 1 },
        { item: giftCatalog[1], quantity: 2 },
        { item: giftCatalog[3], quantity: 1 },
      ],
    });
    refresh();
    setSelectedCode(request.requestCode);
  }

  function resetLocalDemoData() {
    localRequestRepository.clearAll();
    setRequests([]);
    setSelectedCode("");
  }

  return (
    <main className="min-h-screen bg-[#f8fbf9] px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link className="focus-ring inline-flex rounded-full border border-plum/20 bg-white px-5 py-3 text-sm font-black text-plum" href="/">
              Back to website
            </Link>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-rose">Demo</p>
            <h1 className="mt-2 font-serif text-5xl font-bold">Krivya Request Dashboard</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink/64">
              Local browser storage only. This is a management-interface demo, not authentication or production storage.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <button type="button" className="focus-ring rounded-full bg-plum px-6 py-4 text-sm font-black text-white transition hover:bg-rose" onClick={loadDemoRequest}>
              Load Demo Request
            </button>
            <button type="button" className="focus-ring rounded-full border border-plum/20 bg-white px-6 py-4 text-sm font-black text-plum transition hover:bg-petal" onClick={resetLocalDemoData}>
              Reset Local Demo Data
            </button>
          </div>
        </div>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Request status overview">
          {overviewCounts.map((item) => (
            <button
              key={item.status}
              type="button"
              className="focus-ring rounded-2xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
              onClick={() => setStatus(item.status)}
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">{item.status}</p>
              <p className="mt-3 font-serif text-4xl font-bold text-plum">{item.count}</p>
            </button>
          ))}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_190px]">
              <label className="grid gap-2 text-sm font-black">
                Search Request ID or customer
                <input className="focus-ring rounded-2xl border border-ink/10 bg-[#f8fbf9] px-4 py-3 text-base" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Paste KRV-260915-A7F4 or type a name" />
              </label>
              <label className="grid gap-2 text-sm font-black">
                Status
                <select className="focus-ring rounded-2xl border border-ink/10 bg-[#f8fbf9] px-4 py-3 text-base" value={status} onChange={(event) => setStatus(event.target.value as GiftRequestStatus | "All")}>
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 grid gap-3">
              {filtered.length === 0 ? (
                <div className="rounded-2xl bg-[#f8fbf9] p-6 text-sm leading-6 text-ink/64">No local demo requests match this view.</div>
              ) : null}
              {filtered.map((request) => (
                <button
                  key={request.requestCode}
                  type="button"
                  className={`focus-ring rounded-2xl border p-4 text-left transition ${
                    selectedRequest?.requestCode === request.requestCode ? "border-plum bg-petal" : "border-ink/10 bg-white hover:border-plum/40"
                  }`}
                  onClick={() => setSelectedCode(request.requestCode)}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black text-plum">{request.requestCode}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold">{request.customer.customerName}</p>
                        {isDemoRequest(request) ? <span className="rounded-full bg-ribbon px-2 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-ink">Demo Request</span> : null}
                      </div>
                      <p className="mt-1 text-sm text-ink/60">
                        {request.customer.destination} · {request.customer.occasion}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-black text-rose ring-1 ring-plum/10">{request.status}</span>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs font-bold text-ink/55 sm:grid-cols-3">
                    <span>{request.customer.preferredDeliveryDate}</span>
                    <span>{new Date(request.createdAt).toLocaleString()}</span>
                    <span>{request.items.reduce((total, entry) => total + entry.quantity, 0)} items</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm">
            {selectedRequest ? (
              <RequestDetail request={selectedRequest} onStatusChange={updateStatus} />
            ) : (
              <div className="rounded-2xl bg-[#f8fbf9] p-6 text-sm leading-6 text-ink/64">Create a request from the Gift Store or load one demo request to inspect details here.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function RequestDetail({ request, onStatusChange }: { request: GiftRequest; onStatusChange: (requestCode: string, status: GiftRequestStatus) => void }) {
  const customerWhatsApp = buildCustomerWhatsAppUrl(request.customer.phone, request.requestCode);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-rose">Request detail</p>
          <h2 className="mt-2 font-serif text-4xl font-bold text-plum">{request.requestCode}</h2>
          {isDemoRequest(request) ? <p className="mt-2 w-fit rounded-full bg-ribbon px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-ink">Demo Request</p> : null}
        </div>
        <label className="grid gap-2 text-sm font-black">
          Update status
          <select className="focus-ring rounded-2xl border border-ink/10 bg-[#f8fbf9] px-4 py-3 text-base" value={request.status} onChange={(event) => onStatusChange(request.requestCode, event.target.value as GiftRequestStatus)}>
            {statuses
              .filter((item): item is GiftRequestStatus => item !== "All")
              .map((item) => (
                <option key={item}>{item}</option>
              ))}
          </select>
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <AdminRow label="Customer" value={request.customer.customerName} />
        <AdminRow label="Phone / WhatsApp" value={request.customer.phone} />
        <AdminRow label="Email" value={request.customer.email || "Not provided"} />
        <AdminRow label="Status" value={request.status} />
        <AdminRow label="Destination" value={request.customer.destination} />
        <AdminRow label="Occasion" value={request.customer.occasion} />
        <AdminRow label="Preferred date" value={request.customer.preferredDeliveryDate} />
        <AdminRow label="Created" value={new Date(request.createdAt).toLocaleString()} />
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-black">Selected components</h3>
        <div className="mt-3 grid gap-3">
          {request.items.map((entry) => (
            <div key={entry.item.id} className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-[#f8fbf9] p-3">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                <Image src={entry.item.imagePath} alt="" fill sizes="72px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">{entry.item.category}</p>
                <p className="mt-1 font-black">{entry.item.name}</p>
                <p className="mt-1 text-xs leading-5 text-ink/52">{entry.item.description}</p>
                <p className="mt-1 text-xs text-ink/45">{entry.item.id}</p>
              </div>
              <p className="rounded-full bg-white px-3 py-1 text-sm font-black">x{entry.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <AdminBlock label="Personalization" value={request.customer.personalizationNotes || "Not provided"} />
        <AdminBlock label="Gift message" value={request.customer.giftMessage || "Not provided"} />
        <AdminBlock label="Notes" value={request.customer.additionalNotes || "Not provided"} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {customerWhatsApp ? (
          <a className="focus-ring rounded-full bg-plum px-6 py-4 text-center text-sm font-black text-white transition hover:bg-rose" href={customerWhatsApp} target="_blank" rel="noreferrer">
            Contact on WhatsApp
          </a>
        ) : null}
        <Link className="focus-ring rounded-full border border-plum/20 px-6 py-4 text-center text-sm font-black text-plum transition hover:bg-petal" href={`/request/${request.requestCode}`}>
          Customer View
        </Link>
      </div>
    </div>
  );
}

function isDemoRequest(request: GiftRequest) {
  return request.customer.customerName === demoMarker || request.customer.additionalNotes.includes(demoMarker);
}

function AdminRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8fbf9] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{label}</p>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}

function AdminBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8fbf9] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{label}</p>
      <p className="mt-2 leading-7 text-ink/70">{value}</p>
    </div>
  );
}
