import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/requests/adminAuth";
import { getGiftRequest, getGiftRequestForCustomer, updateGiftRequestStatus } from "@/lib/requests/supabaseServer";
import type { GiftRequestStatus } from "@/lib/requests/types";

const statuses: GiftRequestStatus[] = ["New", "Reviewing", "Contacted", "Confirmed", "Completed", "Cancelled"];

interface RouteContext {
  params: Promise<{ requestCode: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const { requestCode } = await context.params;

  try {
    const auth = verifyAdminToken(request);
    const url = new URL(request.url);
    const phone = url.searchParams.get("phone") || "";

    const giftRequest = auth.ok ? await getGiftRequest(requestCode) : phone ? await getGiftRequestForCustomer(requestCode, phone) : null;

    if (!giftRequest) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    return NextResponse.json({ request: giftRequest });
  } catch {
    return NextResponse.json({ error: "Request couldn't be loaded. Try again." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = verifyAdminToken(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { requestCode } = await context.params;
    const body = (await request.json()) as { status?: GiftRequestStatus };

    if (!body.status || !statuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid request status." }, { status: 400 });
    }

    const updatedRequest = await updateGiftRequestStatus(requestCode, body.status);
    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    return NextResponse.json({ request: updatedRequest });
  } catch {
    return NextResponse.json({ error: "Request status couldn't be updated. Try again." }, { status: 500 });
  }
}
