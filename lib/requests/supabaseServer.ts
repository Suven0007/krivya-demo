import { generateRequestCode } from "./requestCode";
import type { CustomerDetails, GiftBasketItem, GiftItem, GiftRequest, GiftRequestDraft, GiftRequestStatus } from "./types";

type SupabaseGiftRequestRow = {
  id: string;
  request_id?: string | null;
  request_code?: string | null;
  status: string;
  customer_name: string;
  customer_email?: string | null;
  customer_phone?: string | null;
  phone?: string | null;
  email?: string | null;
  recipient_name?: string | null;
  recipient?: string | null;
  destination: string;
  preferred_delivery_date: string;
  occasion: string;
  selected_items: StoredGiftItem[];
  personalization_details?: string | null;
  personalization_notes?: string | null;
  gift_message: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
};

type StoredGiftItem = {
  item_id: string;
  name: string;
  category: string;
  quantity: number;
  image_path: string;
  description: string;
};

const allowedStatuses: GiftRequestStatus[] = ["New", "Reviewing", "Contacted", "Confirmed", "Completed", "Cancelled"];
const dbStatusByUiStatus: Record<GiftRequestStatus, string> = {
  New: "new",
  Reviewing: "reviewing",
  Contacted: "contacted",
  Confirmed: "confirmed",
  Completed: "completed",
  Cancelled: "cancelled",
};
const uiStatusByDbStatus: Record<string, GiftRequestStatus> = {
  New: "New",
  Reviewing: "Reviewing",
  Contacted: "Contacted",
  Confirmed: "Confirmed",
  Completed: "Completed",
  Cancelled: "Cancelled",
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase server environment is not configured.");
  }

  return { url: url.replace(/\/$/, ""), serviceRoleKey };
}

async function supabaseFetch<T>(path: string, init: RequestInit = {}) {
  const { url, serviceRoleKey } = supabaseConfig();
  const response = await fetch(`${url}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Supabase request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function toStoredItem(entry: GiftBasketItem): StoredGiftItem {
  return {
    item_id: entry.item.id,
    name: entry.item.name,
    category: entry.item.category,
    quantity: entry.quantity,
    image_path: entry.item.imagePath,
    description: entry.item.description,
  };
}

function toGiftItem(entry: StoredGiftItem): GiftBasketItem {
  const item: GiftItem = {
    id: entry.item_id,
    name: entry.name,
    category: entry.category as GiftItem["category"],
    imagePath: entry.image_path,
    description: entry.description,
  };

  return { item, quantity: entry.quantity };
}

function toRequest(row: SupabaseGiftRequestRow): GiftRequest {
  const customer: CustomerDetails = {
    customerName: row.customer_name,
    phone: row.customer_phone || row.phone || "",
    email: row.customer_email || row.email || "",
    destination: row.destination as CustomerDetails["destination"],
    occasion: row.occasion as CustomerDetails["occasion"],
    recipient: row.recipient_name || row.recipient || "",
    preferredDeliveryDate: row.preferred_delivery_date,
    budget: "",
    personalizationNotes: row.personalization_details || row.personalization_notes || "",
    giftMessage: row.gift_message ?? "",
    additionalNotes: row.additional_notes ?? "",
  };

  return {
    id: row.id,
    requestCode: row.request_id || row.request_code || "",
    customer,
    items: Array.isArray(row.selected_items) ? row.selected_items.map(toGiftItem) : [],
    status: uiStatusByDbStatus[row.status] ?? "New",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function digits(value: string) {
  return value.replace(/\D/g, "");
}

function buildInsertPayload(draft: GiftRequestDraft, requestCode: string) {
  return {
    request_id: requestCode,
    request_code: requestCode,
    status: dbStatusByUiStatus.New,
    customer_name: draft.customer.customerName.trim(),
    customer_email: draft.customer.email?.trim() || null,
    customer_phone: draft.customer.phone.trim(),
    email: draft.customer.email?.trim() || null,
    phone: draft.customer.phone.trim(),
    recipient_name: draft.customer.recipient.trim(),
    recipient: draft.customer.recipient.trim(),
    budget: "",
    destination: draft.customer.destination,
    preferred_delivery_date: draft.customer.preferredDeliveryDate,
    occasion: draft.customer.occasion,
    selected_items: draft.items.map(toStoredItem),
    personalization_details: draft.customer.personalizationNotes.trim() || null,
    personalization_notes: draft.customer.personalizationNotes.trim() || null,
    gift_message: draft.customer.giftMessage.trim() || null,
    additional_notes: draft.customer.additionalNotes.trim() || null,
  };
}

export async function createGiftRequest(draft: GiftRequestDraft) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const requestCode = generateRequestCode();

    try {
      const rows = await supabaseFetch<SupabaseGiftRequestRow[]>("/gift_requests", {
        method: "POST",
        body: JSON.stringify(buildInsertPayload(draft, requestCode)),
      });

      const row = rows[0];
      if (!row) {
        throw new Error("Supabase did not return the created request.");
      }

      return toRequest(row);
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : "";
      if (!message.includes("23505") && !message.toLowerCase().includes("duplicate")) {
        throw error;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Unable to create a unique request ID.");
}

export async function listGiftRequests({ query = "", status = "All" }: { query?: string; status?: GiftRequestStatus | "All" }) {
  const filters = new URLSearchParams();
  filters.set("select", "*");
  filters.set("order", "created_at.desc");
  filters.set("limit", "100");

  if (status !== "All") {
    filters.set("status", `eq.${dbStatusByUiStatus[status]}`);
  }

  const needle = query.trim();
  if (needle) {
    const escaped = needle.replace(/[%*,]/g, "");
    filters.set("or", `(request_id.ilike.*${escaped}*,request_code.ilike.*${escaped}*,customer_name.ilike.*${escaped}*,customer_phone.ilike.*${escaped}*,phone.ilike.*${escaped}*)`);
  }

  const rows = await supabaseFetch<SupabaseGiftRequestRow[]>(`/gift_requests?${filters.toString()}`, {
    method: "GET",
  });
  return rows.map(toRequest);
}

export async function getGiftRequest(requestCode: string) {
  const filters = new URLSearchParams();
  filters.set("select", "*");
  filters.set("request_id", `eq.${requestCode}`);
  filters.set("limit", "1");

  const rows = await supabaseFetch<SupabaseGiftRequestRow[]>(`/gift_requests?${filters.toString()}`, {
    method: "GET",
  });
  return rows[0] ? toRequest(rows[0]) : null;
}

export async function getGiftRequestForCustomer(requestCode: string, phone: string) {
  const request = await getGiftRequest(requestCode);
  if (!request) {
    return null;
  }

  if (digits(request.customer.phone).slice(-7) !== digits(phone).slice(-7)) {
    return null;
  }

  return request;
}

export async function updateGiftRequestStatus(requestCode: string, status: GiftRequestStatus) {
  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid request status.");
  }

  const rows = await supabaseFetch<SupabaseGiftRequestRow[]>(`/gift_requests?request_id=eq.${encodeURIComponent(requestCode)}`, {
    method: "PATCH",
    body: JSON.stringify({ status: dbStatusByUiStatus[status], updated_at: new Date().toISOString() }),
  });

  const row = rows[0];
  return row ? toRequest(row) : null;
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
