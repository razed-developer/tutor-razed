import { handleError, json, requireAdmin, requireDatabase, type Env } from "../../../_shared/http";
import { listResources, replaceRelations, validateResource, type ResourceInput } from "../../../_shared/resources";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try { requireAdmin(request, env); requireDatabase(env); return json({ resources: await listResources(env, false) }); }
  catch (error) { return handleError(error); }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const actor = requireAdmin(request, env); const db = requireDatabase(env);
    const input = validateResource(await request.json<ResourceInput>());
    const id = input.id?.trim() || crypto.randomUUID();
    await db.prepare(`INSERT INTO resources
      (id,title,description,subject,type,thumbnail,url,rating,status,featured,sort_order,published_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,CASE WHEN ? = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END)`)
      .bind(id,input.title,input.description ?? "",input.subject,input.type ?? "Website",input.thumbnail ?? "",input.url,input.rating ?? 0,input.status ?? "draft",input.featured ? 1 : 0,input.sortOrder ?? 0,input.status ?? "draft").run();
    await replaceRelations(db, id, input);
    await db.prepare("INSERT INTO audit_log(actor_email,action,entity_type,entity_id) VALUES (?,'create','resource',?)").bind(actor,id).run();
    return json({ id }, 201);
  } catch (error) { return handleError(error); }
};
