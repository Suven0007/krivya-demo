import type { GiftRequest, GiftRequestDraft, GiftRequestStatus } from "./types";

export interface RequestRepository {
  createRequest(draft: GiftRequestDraft): GiftRequest;
  getRequest(requestCode: string): GiftRequest | null;
  listRequests(): GiftRequest[];
  updateStatus(requestCode: string, status: GiftRequestStatus): GiftRequest | null;
  clearAll(): void;
}
