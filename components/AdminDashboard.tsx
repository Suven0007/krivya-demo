"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { apiRequestRepository } from "@/lib/requests/apiRequestRepository";
import { buildCustomerWhatsAppUrl } from "@/lib/requests/whatsapp";
import type { GiftRequest, GiftRequestStatus } from "@/lib/requests/types";

const statuses: Array<GiftRequestStatus | "All"> = ["All", "New", "Reviewing", "Contacted", "Confirmed", "Completed", "Cancelled"];
const overviewStatuses: GiftRequestStatus[] = ["New", "Reviewing", "Contacted", "Confirmed", "Completed"];
const ADMIN_TOKEN_STORAGE_KEY = "krivya.adminDemoToken.v1";

function totalItems(request: GiftRequest) {
  return request.items.reduce((total, entry) => total + entry.quantity, 0);
}

function formatDisplayDate(value: string) {
  if (!value) {
    return "Not provided";
  }

  const [year, month, day] = value.split("-");
  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusTone(status: GiftRequestStatus) {
  const tones: Record<GiftRequestStatus, string> = {
    New: "bg-ribbon text-ink ring-ribbon/60",
    Reviewing: "bg-petal text-plum ring-plum/15",
    Contacted: "bg-white text-rose ring-rose/20",
    Confirmed: "bg-[#e7f4ec] text-[#22623f] ring-[#22623f]/15",
    Completed: "bg-[#e8f0f8] text-[#24537a] ring-[#24537a]/15",
    Cancelled: "bg-[#f4e7e7] text-[#843434] ring-[#843434]/15",
  };

  return tones[status];
}

export function AdminDashboard() {
  const [requests, setRequests] = useState<GiftRequest[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<GiftRequestStatus | "All">("All");
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedToken = window.sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";
      setAdminToken(savedToken);
      setTokenInput(savedToken);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!statusMessage) {
      return undefined;
    }

    const timer = window.setTimeout(() => setStatusMessage(""), 3000);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  useEffect(() => {
    if (!adminToken) {
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setLoadError("");

      try {
        const loaded = await apiRequestRepository.listRequests({ query, status, adminToken });
        if (!active) {
          return;
        }
        setRequests(loaded);
        setSelectedCode((current) => (loaded.some((request) => request.requestCode === current) ? current : loaded[0]?.requestCode || ""));
      } catch (error) {
        if (!active) {
          return;
        }
        setRequests([]);
        setSelectedCode("");
        setLoadError(error instanceof Error ? error.message : "Requests couldn't be loaded. Try again.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [adminToken, query, status]);

  const filtered = requests;
  const selectedRequest = filtered.find((request) => request.requestCode === selectedCode) ?? filtered[0] ?? null;
  const overviewCounts = useMemo(
    () =>
      overviewStatuses.map((item) => ({
        status: item,
        count: requests.filter((request) => request.status === item).length,
      })),
    [requests],
  );

  async function updateStatus(requestCode: string, nextStatus: GiftRequestStatus) {
    if (!adminToken) {
      return;
    }

    setLoadError("");
    try {
      const updated = await apiRequestRepository.updateStatus(requestCode, nextStatus, adminToken);
      setRequests((current) => current.map((request) => (request.requestCode === updated.requestCode ? updated : request)));
      setSelectedCode(updated.requestCode);
      setStatusMessage(`${updated.requestCode} moved to ${updated.status}.`);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Request status couldn't be updated. Try again.");
    }
  }

  function saveAccessCode() {
    const trimmed = tokenInput.trim();
    window.sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, trimmed);
    setAdminToken(trimmed);
  }

  return (
    <main className="min-h-screen bg-[#f8fbf9] px-4 py-6 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 border-b border-ink/10 pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="min-w-0">
            <Link className="focus-ring inline-flex rounded-full border border-plum/20 bg-white px-4 py-2.5 text-sm font-black text-plum" href="/">
              Back to website
            </Link>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-rose">Demo request dashboard</p>
            <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-plum sm:text-5xl">Find the gift request behind every WhatsApp ID.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/64 sm:text-base sm:leading-7">
              Paste a Request ID from WhatsApp, review the selected gifts and customer details, then update the request status from the shared Supabase demo.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm lg:w-[360px]">
            <label className="grid gap-2 text-sm font-black">
              Admin demo access code
              <input
                className="focus-ring rounded-2xl border border-ink/10 bg-[#f8fbf9] px-4 py-3 text-base"
                type="password"
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                placeholder="Enter access code"
              />
            </label>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button type="button" className="focus-ring rounded-full bg-plum px-5 py-3 text-sm font-black text-white transition hover:bg-rose" onClick={saveAccessCode}>
                Unlock Dashboard
              </button>
              <button
                type="button"
                className="focus-ring rounded-full border border-plum/20 bg-white px-5 py-3 text-sm font-black text-plum transition hover:bg-petal"
                onClick={() => {
                  window.sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
                  setAdminToken("");
                  setTokenInput("");
                  setRequests([]);
                  setSelectedCode("");
                  setLoadError("");
                }}
              >
                Lock
              </button>
            </div>
          </div>
        </div>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Request status overview">
          {overviewCounts.map((item) => (
            <button
              key={item.status}
              type="button"
              className={`focus-ring rounded-2xl p-4 text-left shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-soft ${status === item.status ? "bg-petal ring-plum/25" : "bg-white ring-ink/5"}`}
              onClick={() => setStatus(item.status)}
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">{item.status}</p>
              <p className="mt-2 font-serif text-3xl font-bold text-plum">{item.count}</p>
            </button>
          ))}
        </section>

        {statusMessage ? (
          <p className="mt-5 rounded-2xl border border-[#22623f]/15 bg-[#e7f4ec] px-4 py-3 text-sm font-bold text-[#22623f]" role="status">
            {statusMessage}
          </p>
        ) : null}
        {loadError ? (
          <p className="mt-5 rounded-2xl border border-rose/25 bg-rose/8 px-4 py-3 text-sm font-bold text-rose" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <section className="min-w-0 rounded-3xl bg-white p-4 shadow-sm sm:p-5">
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
              <label className="grid gap-2 text-sm font-black">
                Search Request ID
                <span className="relative block">
                  <input
                    className="focus-ring w-full rounded-2xl border border-ink/10 bg-[#f8fbf9] px-4 py-3 pr-20 text-base font-semibold uppercase tracking-[0.03em]"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="KRV-48372"
                  />
                  {query ? (
                    <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-black text-plum hover:bg-petal" onClick={() => setQuery("")}>
                      Clear
                    </button>
                  ) : null}
                </span>
                <span className="text-xs font-semibold normal-case tracking-normal text-ink/52">Customer name or phone also works for live conversations.</span>
              </label>
              <label className="grid gap-2 text-sm font-black">
                Status filter
                <select className="focus-ring rounded-2xl border border-ink/10 bg-[#f8fbf9] px-4 py-3 text-base" value={status} onChange={(event) => setStatus(event.target.value as GiftRequestStatus | "All")}>
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em] text-ink/45">
              <span>{loading ? "Loading" : `${filtered.length} visible`}</span>
              <span>{requests.length} shared total</span>
            </div>

            <div className="mt-4 grid gap-3">
              {!adminToken ? (
                <div className="rounded-2xl bg-[#f8fbf9] p-6 text-sm leading-6 text-ink/64">Enter the admin demo access code to load shared gift requests.</div>
              ) : null}
              {adminToken && loading ? (
                <div className="rounded-2xl bg-[#f8fbf9] p-6 text-sm leading-6 text-ink/64">Loading shared requests...</div>
              ) : null}
              {adminToken && !loading && filtered.length === 0 ? (
                <div className="rounded-2xl bg-[#f8fbf9] p-6 text-sm leading-6 text-ink/64">No requests match this Request ID or search.</div>
              ) : null}
              {filtered.map((request) => (
                <RequestListCard key={request.requestCode} request={request} selected={selectedRequest?.requestCode === request.requestCode} onSelect={() => setSelectedCode(request.requestCode)} />
              ))}
            </div>
          </section>

          <section className="min-w-0 rounded-3xl bg-white p-4 shadow-sm sm:p-5">
            {selectedRequest ? (
              <RequestDetail request={selectedRequest} onStatusChange={updateStatus} />
            ) : (
              <div className="rounded-2xl bg-[#f8fbf9] p-6 text-sm leading-6 text-ink/64">Create a request from the Gift Store, then search its Request ID here.</div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function RequestListCard({ request, selected, onSelect }: { request: GiftRequest; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      className={`focus-ring w-full rounded-2xl border p-4 text-left transition ${
        selected ? "border-plum bg-petal shadow-soft" : "border-ink/10 bg-white hover:border-plum/40 hover:bg-[#fffafb]"
      }`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-all text-base font-black text-plum">{request.requestCode}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="font-bold">{request.customer.customerName}</p>
          </div>
          <p className="mt-1 text-sm text-ink/62">
            {request.customer.destination} / {request.customer.occasion}
          </p>
        </div>
        <StatusPill status={request.status} />
      </div>
      <div className="mt-4 grid gap-2 text-xs font-bold text-ink/58 sm:grid-cols-3">
        <span>
          <span className="block font-black uppercase tracking-[0.12em] text-rose">Preferred</span>
          {formatDisplayDate(request.customer.preferredDeliveryDate)}
        </span>
        <span>
          <span className="block font-black uppercase tracking-[0.12em] text-rose">Created</span>
          {formatDateTime(request.createdAt)}
        </span>
        <span>
          <span className="block font-black uppercase tracking-[0.12em] text-rose">Gift items</span>
          {totalItems(request)} selected
        </span>
      </div>
    </button>
  );
}

function RequestDetail({ request, onStatusChange }: { request: GiftRequest; onStatusChange: (requestCode: string, status: GiftRequestStatus) => void }) {
  const customerWhatsApp = buildCustomerWhatsAppUrl(request.customer.phone, request.requestCode);

  return (
    <div>
      <div className="grid gap-4 border-b border-ink/10 pb-5 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-rose">Request detail</p>
          <h2 className="mt-2 break-all font-serif text-3xl font-bold text-plum sm:text-4xl">{request.requestCode}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill status={request.status} />
          </div>
          <p className="mt-3 text-sm leading-6 text-ink/60">Everything Krivya needs to understand this customer&apos;s gift request is gathered below.</p>
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

      <div className="mt-5 grid gap-4">
        <DetailGroup title="Customer">
          <AdminRow label="Name" value={request.customer.customerName} />
          <AdminRow label="Phone / WhatsApp" value={request.customer.phone} />
          <AdminRow label="Email" value={request.customer.email || "Not provided"} />
        </DetailGroup>

        <DetailGroup title="Gift context">
          <AdminRow label="Destination" value={request.customer.destination} />
          <AdminRow label="Occasion" value={request.customer.occasion} />
          <AdminRow label="Recipient" value={request.customer.recipient} />
          <AdminRow label="Preferred date" value={formatDisplayDate(request.customer.preferredDeliveryDate)} />
          <AdminRow label="Created" value={formatDateTime(request.createdAt)} />
          <AdminRow label="Last updated" value={formatDateTime(request.updatedAt)} />
        </DetailGroup>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">Selected gift items</p>
            <h3 className="mt-1 text-xl font-black">{totalItems(request)} pieces in this request</h3>
          </div>
        </div>
        <div className="mt-3 grid gap-3">
          {request.items.map((entry) => (
            <div key={entry.item.id} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-2xl bg-[#f8fbf9] p-3 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-white">
                <Image src={entry.item.imagePath} alt="" fill sizes="72px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-rose">{entry.item.category}</p>
                <p className="mt-1 font-black">{entry.item.name}</p>
                <p className="mt-1 break-all text-xs text-ink/45">{entry.item.id}</p>
              </div>
              <p className="col-span-2 w-fit rounded-full bg-white px-3 py-1 text-sm font-black ring-1 ring-ink/5 sm:col-span-1">Quantity {entry.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <AdminBlock label="Personalization" value={request.customer.personalizationNotes || "Not provided"} />
        <AdminBlock label="Gift message" value={request.customer.giftMessage || "Not provided"} />
        <AdminBlock label="Additional notes" value={request.customer.additionalNotes || "Not provided"} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {customerWhatsApp ? (
          <a className="focus-ring rounded-full bg-plum px-6 py-4 text-center text-sm font-black text-white transition hover:bg-rose" href={customerWhatsApp} target="_blank" rel="noreferrer">
            Open WhatsApp
          </a>
        ) : null}
        <Link className="focus-ring rounded-full border border-plum/20 px-6 py-4 text-center text-sm font-black text-plum transition hover:bg-petal" href={`/request/${request.requestCode}`}>
          Customer View
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: GiftRequestStatus }) {
  return <span className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ring-1 ${statusTone(status)}`}>{status}</span>;
}

function DetailGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-black uppercase tracking-[0.16em] text-rose">{title}</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">{children}</div>
    </section>
  );
}

function AdminRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-[#f8fbf9] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{label}</p>
      <p className="mt-2 break-words font-bold">{value}</p>
    </div>
  );
}

function AdminBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8fbf9] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-rose">{label}</p>
      <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-ink/70">{value}</p>
    </div>
  );
}
