import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/requests/adminAuth";
import { createGiftRequest, listGiftRequests } from "@/lib/requests/supabaseServer";
import type { GiftRequestDraft, GiftRequestStatus } from "@/lib/requests/types";

const statuses: Array<GiftRequestStatus | "All"> = ["All", "New", "Reviewing", "Contacted", "Confirmed", "Completed", "Cancelled"];

function isDraft(value: unknown): value is GiftRequestDraft {
  const draft = value as GiftRequestDraft;
  return Boolean(
    draft &&
      Array.isArray(draft.items) &&
      draft.items.length > 0 &&
      draft.customer?.customerName &&
      draft.customer?.phone &&
      draft.customer?.recipient &&
      draft.customer?.destination &&
      draft.customer?.occasion &&
      draft.customer?.preferredDeliveryDate,
  );
}

export async function POST(request: Request) {
  try {
    const draft = (await request.json()) as unknown;

    if (!isDraft(draft)) {
      return NextResponse.json({ error: "Gift request is incomplete." }, { status: 400 });
    }

    const savedRequest = await createGiftRequest(draft);
    return NextResponse.json({ request: savedRequest }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We couldn't save your gift request. Kindly try again." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const auth = verifyAdminToken(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "All";
    const query = url.searchParams.get("query") || "";

    if (!statuses.includes(status as GiftRequestStatus | "All")) {
      return NextResponse.json({ error: "Invalid status filter." }, { status: 400 });
    }

    const requests = await listGiftRequests({ query, status: status as GiftRequestStatus | "All" });
    return NextResponse.json({ requests });
  } catch {
    return NextResponse.json({ error: "Requests couldn't be loaded. Try again." }, { status: 500 });
  }
}
