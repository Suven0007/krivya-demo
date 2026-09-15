export const krivyaWhatsAppNumber = "9779851414905";

export function buildKrivyaRequestWhatsAppUrl(requestCode: string) {
  const message = `Hi Krivya, I've created a personalized gift request.\n\nRequest ID: ${requestCode}\n\nKindly review my request and confirm availability.`;
  return `https://wa.me/${krivyaWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}

export function buildCustomerWhatsAppUrl(phone: string, requestCode: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  const message = `Hi, this is Krivya about your gift request ${requestCode}.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
