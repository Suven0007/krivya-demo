import type { GiftRequest, GiftRequestDraft, GiftRequestStatus } from "./types";

interface RequestListOptions {
  query?: string;
  status?: GiftRequestStatus | "All";
  adminToken?: string;
}

function adminHeaders(adminToken?: string) {
  const headers: Record<string, string> = {};
  if (adminToken) {
    headers["x-krivya-admin-token"] = adminToken;
  }
  return headers;
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

export const apiRequestRepository = {
  async createRequest(draft: GiftRequestDraft) {
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const payload = await readJson<{ request: GiftRequest }>(response);
    return payload.request;
  },

  async getRequest(requestCode: string, phone?: string, adminToken?: string) {
    const params = new URLSearchParams();
    if (phone) {
      params.set("phone", phone);
    }
    const query = params.toString();
    const response = await fetch(`/api/requests/${encodeURIComponent(requestCode)}${query ? `?${query}` : ""}`, {
      headers: adminHeaders(adminToken),
    });

    if (response.status === 404) {
      return null;
    }

    const payload = await readJson<{ request: GiftRequest }>(response);
    return payload.request;
  },

  async listRequests({ query = "", status = "All", adminToken }: RequestListOptions) {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("query", query.trim());
    }
    if (status !== "All") {
      params.set("status", status);
    }

    const response = await fetch(`/api/requests?${params.toString()}`, {
      headers: adminHeaders(adminToken),
    });
    const payload = await readJson<{ requests: GiftRequest[] }>(response);
    return payload.requests;
  },

  async updateStatus(requestCode: string, status: GiftRequestStatus, adminToken: string) {
    const response = await fetch(`/api/requests/${encodeURIComponent(requestCode)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...adminHeaders(adminToken) },
      body: JSON.stringify({ status }),
    });
    const payload = await readJson<{ request: GiftRequest }>(response);
    return payload.request;
  },
};
