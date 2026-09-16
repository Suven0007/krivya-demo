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

function randomFiveDigitNumber() {
  const bytes = new Uint32Array(1);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(bytes);
    return bytes[0] % 100000;
  }

  return Math.floor(Math.random() * 100000);
}

export function generateRequestCode(existingCodes: string[]) {
  let candidate = `KRV-${String(randomFiveDigitNumber()).padStart(5, "0")}`;
  let attempts = 0;

  while (existingCodes.includes(candidate) && attempts < 12) {
    candidate = `KRV-${String(randomFiveDigitNumber()).padStart(5, "0")}`;
    attempts += 1;
  }

  return candidate;
}

export const localRequestRepository: RequestRepository = {
  createRequest(draft: GiftRequestDraft) {
    const requests = readRequests();
    const now = new Date().toISOString();
    const request: GiftRequest = {
      id: typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : `${Date.now()}-${randomFiveDigitNumber()}`,
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
