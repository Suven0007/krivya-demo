export function verifyAdminToken(request: Request) {
  const expected = process.env.KRIVYA_ADMIN_DEMO_TOKEN;

  if (!expected) {
    return {
      ok: false,
      status: 503,
      error: "Admin demo access is not configured.",
    };
  }

  const provided = request.headers.get("x-krivya-admin-token")?.trim();
  if (!provided || provided !== expected) {
    return {
      ok: false,
      status: 401,
      error: "Admin demo access code is required.",
    };
  }

  return { ok: true, status: 200, error: "" };
}
