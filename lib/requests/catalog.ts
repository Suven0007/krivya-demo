import type { DeliveryDestination, GiftItem, GiftOccasion } from "./types";

export const deliveryDestinations: DeliveryDestination[] = ["Australia", "United Arab Emirates", "Nepal", "United Kingdom"];

export const giftOccasions: GiftOccasion[] = ["Birthday", "Anniversary", "Love & Romance", "Congratulations", "Just Because", "Other"];

export const giftCatalog: GiftItem[] = [
  {
    id: "KRV-FLW-01",
    name: "Rose Bouquet",
    category: "Flowers",
    imagePath: "/images/13.jpeg",
    description: "Roses and soft florals that can set the mood for romantic or celebratory gifts.",
  },
  {
    id: "KRV-CHC-01",
    name: "Chocolate Selection",
    category: "Chocolates",
    imagePath: "/images/22.jpeg",
    description: "Chocolate components Krivya can review for availability before confirming.",
  },
  {
    id: "KRV-TDY-01",
    name: "Teddy Bear",
    category: "Teddy Bears",
    imagePath: "/images/14.jpeg",
    description: "A warm plush detail for birthdays, romance, or across-distance surprises.",
  },
  {
    id: "KRV-PHT-01",
    name: "Personalized Photo Frame",
    category: "Photo Frames",
    imagePath: "/images/29.jpeg",
    description: "A personal photo moment to make the gift feel made for one person.",
  },
  {
    id: "KRV-MUG-01",
    name: "Personalized Mug",
    category: "Personalized Mugs",
    imagePath: "/images/24.jpeg",
    description: "A practical keepsake that can carry a personal photo or memory.",
  },
  {
    id: "KRV-CND-01",
    name: "Scented Candle",
    category: "Candles",
    imagePath: "/images/28.jpeg",
    description: "A soft finishing detail for a calm, elegant gift box.",
  },
  {
    id: "KRV-PRF-01",
    name: "Perfume Gift",
    category: "Perfume",
    imagePath: "/images/27.jpeg",
    description: "A premium personal-care detail to include in a guided gift request.",
  },
  {
    id: "KRV-KPS-01",
    name: "Keepsake Detail",
    category: "Keepsakes",
    imagePath: "/images/26.jpeg",
    description: "Small memory-led pieces for handwritten, emotional gifting.",
  },
  {
    id: "KRV-BTL-01",
    name: "Message Bottle",
    category: "Message Bottles",
    imagePath: "/images/26.jpeg",
    description: "A tiny message-led accent for personal notes and surprise reveals.",
  },
  {
    id: "KRV-BOX-01",
    name: "Gift Box",
    category: "Gift Boxes",
    imagePath: "/images/3.jpeg",
    description: "A composed Krivya-style box with room for treats, notes, and keepsakes.",
  },
  {
    id: "KRV-ACC-01",
    name: "Accessory Detail",
    category: "Accessories",
    imagePath: "/images/12.jpeg",
    description: "Small practical add-ons that help tailor the request to the recipient.",
  },
  {
    id: "KRV-INS-01",
    name: "Romantic Gift Inspiration",
    category: "Other Inspiration",
    imagePath: "/images/1.jpeg",
    description: "A fuller arrangement style that Krivya can use as direction, not a fixed stock item.",
  },
];
