function randomSuffix() {
  const bytes = new Uint8Array(2);
  if (typeof crypto !== "undefined") {
    crypto.getRandomValues(bytes);
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

export function generateRequestCode() {
  return `KRV-${dateStamp(new Date())}-${randomSuffix()}`;
}
