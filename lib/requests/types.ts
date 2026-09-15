export type GiftRequestStatus = "New" | "Reviewing" | "Contacted" | "Confirmed" | "Completed" | "Cancelled";

export type DeliveryDestination = "Australia" | "United Arab Emirates" | "Nepal" | "United Kingdom";

export type GiftOccasion = "Birthday" | "Anniversary" | "Love & Romance" | "Congratulations" | "Just Because" | "Other";

export type GiftCategory =
  | "Flowers"
  | "Chocolates"
  | "Teddy Bears"
  | "Photo Frames"
  | "Personalized Mugs"
  | "Candles"
  | "Perfume"
  | "Keepsakes"
  | "Message Bottles"
  | "Gift Boxes"
  | "Accessories"
  | "Other Inspiration";

export interface GiftItem {
  id: string;
  name: string;
  category: GiftCategory;
  imagePath: string;
  description: string;
}

export interface GiftBasketItem {
  item: GiftItem;
  quantity: number;
}

export interface CustomerDetails {
  customerName: string;
  phone: string;
  email?: string;
  destination: DeliveryDestination;
  occasion: GiftOccasion;
  recipient: string;
  preferredDeliveryDate: string;
  budget: string;
  personalizationNotes: string;
  giftMessage: string;
  additionalNotes: string;
}

export interface GiftRequest {
  id: string;
  requestCode: string;
  customer: CustomerDetails;
  items: GiftBasketItem[];
  status: GiftRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GiftRequestDraft {
  customer: CustomerDetails;
  items: GiftBasketItem[];
}
