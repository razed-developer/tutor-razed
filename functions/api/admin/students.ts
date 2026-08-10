import { handleError, json, requireAdmin, requireDatabase, type Env } from "../../_shared/http";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const actor = requireAdmin(request, env); const db = requireDatabase(env); const input = await request.json<any>();
    const displayName = String(input.displayName || "").trim(); if (!displayName) return json({ error: "displayName is required" }, 400);
    const id = String(input.id || crypto.randomUUID());
    await db.prepare(`INSERT INTO students(id,display_name,active) VALUES (?,?,?)
      ON CONFLICT(id) DO UPDATE SET display_name=excluded.display_name,active=excluded.active,updated_at=CURRENT_TIMESTAMP`)
      .bind(id, displayName, input.active === false ? 0 : 1).run();
    await db.prepare("INSERT INTO audit_log(actor_email,action,entity_type,entity_id) VALUES (?,'save','student',?)").bind(actor,id).run();
    return json({ id });
  } catch (error) { return handleError(error); }
};
