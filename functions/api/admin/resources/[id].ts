import { handleError, json, requireAdmin, requireDatabase, type Env } from "../../../_shared/http";
import { replaceRelations, validateResource, type ResourceInput } from "../../../_shared/resources";

export const onRequestPut: PagesFunction<Env> = async ({ request, env, params }) => {
  try {
    const actor = requireAdmin(request, env); const db = requireDatabase(env); const id = String(params.id);
    const input = validateResource(await request.json<ResourceInput>());
    const result = await db.prepare(`UPDATE resources SET title=?,description=?,subject=?,type=?,thumbnail=?,url=?,rating=?,status=?,featured=?,sort_order=?,
      published_at=CASE WHEN ?='published' THEN COALESCE(published_at,CURRENT_TIMESTAMP) ELSE published_at END,updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .bind(input.title,input.description ?? "",input.subject,input.type ?? "Website",input.thumbnail ?? "",input.url,input.rating ?? 0,input.status ?? "draft",input.featured ? 1 : 0,input.sortOrder ?? 0,input.status ?? "draft",id).run();
    if (!result.meta.changes) return json({ error: "Resource not found" }, 404);
    await replaceRelations(db, id, input);
    await db.prepare("INSERT INTO audit_log(actor_email,action,entity_type,entity_id) VALUES (?,'update','resource',?)").bind(actor,id).run();
    return json({ id });
  } catch (error) { return handleError(error); }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  try {
    const actor = requireAdmin(request, env); const db = requireDatabase(env); const id = String(params.id);
    const result = await db.prepare("UPDATE resources SET status='archived',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(id).run();
    if (!result.meta.changes) return json({ error: "Resource not found" }, 404);
    await db.prepare("INSERT INTO audit_log(actor_email,action,entity_type,entity_id) VALUES (?,'archive','resource',?)").bind(actor,id).run();
    return json({ id, status: "archived" });
  } catch (error) { return handleError(error); }
};
