export interface Env {
  DB?: D1Database;
  ADMIN_EMAILS?: string;
}

export const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

export const requireDatabase = (env: Env): D1Database => {
  if (!env.DB) throw new Error("D1 binding DB is not configured");
  return env.DB;
};

export const requireAdmin = (request: Request, env: Env): string => {
  const email = request.headers.get("cf-access-authenticated-user-email")?.trim().toLowerCase();
  const allowed = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  if (!email || !allowed.includes(email)) throw new Response("Forbidden", { status: 403 });
  return email;
};

export const handleError = (error: unknown) => {
  if (error instanceof Response) return error;
  console.error(error);
  const message = error instanceof Error && error.message.includes("not configured")
    ? error.message
    : "Internal server error";
  return json({ error: message }, message.includes("not configured") ? 503 : 500);
};
