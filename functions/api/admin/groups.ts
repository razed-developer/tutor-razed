import { handleError, json, requireAdmin, requireDatabase, type Env } from "../../_shared/http";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const actor = requireAdmin(request, env); const db = requireDatabase(env); const input = await request.json<any>();
    const name = String(input.name || "").trim(); if (!name) return json({ error: "name is required" }, 400);
    const id = String(input.id || crypto.randomUUID()); const studentIds = Array.isArray(input.studentIds) ? [...new Set(input.studentIds.map(String))] : [];
    await db.prepare(`INSERT INTO groups(id,name,active) VALUES (?,?,?)
      ON CONFLICT(id) DO UPDATE SET name=excluded.name,active=excluded.active,updated_at=CURRENT_TIMESTAMP`)
      .bind(id, name, input.active === false ? 0 : 1).run();
    const statements = [db.prepare("DELETE FROM group_students WHERE group_id=?").bind(id), ...studentIds.map((studentId) => db.prepare("INSERT INTO group_students(group_id,student_id) VALUES (?,?)").bind(id,studentId))];
    await db.batch(statements);
    await db.prepare("INSERT INTO audit_log(actor_email,action,entity_type,entity_id) VALUES (?,'save','group',?)").bind(actor,id).run();
    return json({ id });
  } catch (error) { return handleError(error); }
};
