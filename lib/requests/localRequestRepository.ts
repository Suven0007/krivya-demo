import type { RequestRepository } from "./requestRepository";
import type { GiftRequest, GiftRequestDraft, GiftRequestStatus } from "./types";

const STORAGE_KEY = "krivya.giftRequests.v1";
let memoryRequests: GiftRequest[] = [];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readRequests(): GiftRequest[] {
  if (!canUseStorage()) {
    return memoryRequests;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GiftRequest[]) : [];
  } catch {
    return [];
  }
}

function writeRequests(requests: GiftRequest[]) {
  if (!canUseStorage()) {
    memoryRequests = requests;
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

function randomSuffix() {
  const bytes = new Uint8Array(2);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }

  return Math.floor(Math.random() * 65536)
    .toString(16)
    .padStart(4, "0")
    .toUpperCase();
}

function dateStamp(date: Date) {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function generateRequestCode(existingCodes: string[]) {
  const stamp = dateStamp(new Date());
  let candidate = `KRV-${stamp}-${randomSuffix()}`;
  let attempts = 0;

  while (existingCodes.includes(candidate) && attempts < 12) {
    candidate = `KRV-${stamp}-${randomSuffix()}`;
    attempts += 1;
  }

  return candidate;
}

export const localRequestRepository: RequestRepository = {
  createRequest(draft: GiftRequestDraft) {
    const requests = readRequests();
    const now = new Date().toISOString();
    const request: GiftRequest = {
      id: typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${randomSuffix()}`,
      requestCode: generateRequestCode(requests.map((item) => item.requestCode)),
      customer: draft.customer,
      items: draft.items,
      status: "New",
      createdAt: now,
      updatedAt: now,
    };

    writeRequests([request, ...requests]);
    return request;
  },

  getRequest(requestCode: string) {
    return readRequests().find((request) => request.requestCode.toLowerCase() === requestCode.toLowerCase()) ?? null;
  },

  listRequests() {
    return readRequests().sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt));
  },

  updateStatus(requestCode: string, status: GiftRequestStatus) {
    const requests = readRequests();
    const index = requests.findIndex((request) => request.requestCode.toLowerCase() === requestCode.toLowerCase());

    if (index === -1) {
      return null;
    }

    const updated: GiftRequest = {
      ...requests[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    requests[index] = updated;
    writeRequests(requests);
    return updated;
  },

  clearAll() {
    writeRequests([]);
  },
};
