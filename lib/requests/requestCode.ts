function randomFiveDigitNumber() {
  const bytes = new Uint32Array(1);
  if (typeof crypto !== "undefined") {
    crypto.getRandomValues(bytes);
    return bytes[0] % 100000;
  }

  return Math.floor(Math.random() * 100000);
}

export function generateRequestCode() {
  return `KRV-${String(randomFiveDigitNumber()).padStart(5, "0")}`;
}
