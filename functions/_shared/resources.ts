import type { Env } from "./http";

export const AGE_BANDS = ["k4", "5-8", "9-12"] as const;
export const STATUSES = ["draft", "published", "archived"] as const;

export interface ResourceInput {
  id?: string;
  title?: string;
  description?: string;
  subject?: string;
  type?: string;
  thumbnail?: string;
  url?: string;
  downloadUrl?: string;
  ageBands?: string[];
  studentIds?: string[];
  groupIds?: string[];
  tags?: string[];
  rating?: number;
  featured?: boolean;
  status?: string;
  sortOrder?: number;
}

const cleanList = (value: unknown) => Array.isArray(value)
  ? [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))]
  : [];

export function validateResource(input: ResourceInput, partial = false) {
  const required = ["title", "subject"] as const;
  if (!partial) for (const field of required) if (!input[field]?.trim()) throw new Response(`${field} is required`, { status: 400 });
  if (input.status && !STATUSES.includes(input.status as typeof STATUSES[number])) throw new Response("Invalid status", { status: 400 });
  const ageBands = cleanList(input.ageBands);
  if (ageBands.some((band) => !AGE_BANDS.includes(band as typeof AGE_BANDS[number]))) throw new Response("Invalid age band", { status: 400 });
  const url = input.url ?? input.downloadUrl;
  if (!partial && !url?.trim()) throw new Response("url is required", { status: 400 });
  return {
    ...input,
    title: input.title?.trim(), description: input.description?.trim(), subject: input.subject?.trim(),
    type: input.type?.trim(), thumbnail: input.thumbnail?.trim(), url: url?.trim(), ageBands,
    studentIds: cleanList(input.studentIds), groupIds: cleanList(input.groupIds), tags: cleanList(input.tags),
  };
}

export async function listResources(env: Env, publicOnly: boolean) {
  const db = env.DB!;
  // Individually assigned content must never appear in the anonymous catalogue.
  // A later authenticated student endpoint will resolve student/group membership.
  const where = publicOnly ? `WHERE r.status = 'published'
    AND NOT EXISTS (SELECT 1 FROM resource_students rs WHERE rs.resource_id = r.id)
    AND NOT EXISTS (SELECT 1 FROM resource_groups rg WHERE rg.resource_id = r.id)` : "";
  const rows = await db.prepare(`
    SELECT r.*,
      COALESCE((SELECT json_group_array(age_band) FROM resource_age_bands WHERE resource_id = r.id), '[]') age_bands,
      COALESCE((SELECT json_group_array(student_id) FROM resource_students WHERE resource_id = r.id), '[]') student_ids,
      COALESCE((SELECT json_group_array(group_id) FROM resource_groups WHERE resource_id = r.id), '[]') group_ids,
      COALESCE((SELECT json_group_array(t.name) FROM resource_tags rt JOIN tags t ON t.id = rt.tag_id WHERE rt.resource_id = r.id), '[]') tags
    FROM resources r ${where}
    ORDER BY r.featured DESC, r.sort_order ASC, r.updated_at DESC
  `).all<Record<string, unknown>>();
  return rows.results.map((row) => ({
    id: row.id, title: row.title, description: row.description, subject: row.subject, type: row.type,
    thumbnail: row.thumbnail, downloadUrl: row.url, rating: row.rating, status: row.status,
    featured: Boolean(row.featured), sortOrder: row.sort_order, date: row.published_at ?? row.created_at,
    ageBands: JSON.parse(String(row.age_bands)), studentIds: JSON.parse(String(row.student_ids)),
    groupIds: JSON.parse(String(row.group_ids)), tags: JSON.parse(String(row.tags)),
  }));
}

export async function replaceRelations(db: D1Database, id: string, input: ReturnType<typeof validateResource>) {
  const statements: D1PreparedStatement[] = [
    db.prepare("DELETE FROM resource_age_bands WHERE resource_id = ?").bind(id),
    db.prepare("DELETE FROM resource_students WHERE resource_id = ?").bind(id),
    db.prepare("DELETE FROM resource_groups WHERE resource_id = ?").bind(id),
    db.prepare("DELETE FROM resource_tags WHERE resource_id = ?").bind(id),
  ];
  for (const band of input.ageBands) statements.push(db.prepare("INSERT INTO resource_age_bands(resource_id, age_band) VALUES (?, ?)").bind(id, band));
  for (const student of input.studentIds) statements.push(db.prepare("INSERT INTO resource_students(resource_id, student_id) VALUES (?, ?)").bind(id, student));
  for (const group of input.groupIds) statements.push(db.prepare("INSERT INTO resource_groups(resource_id, group_id) VALUES (?, ?)").bind(id, group));
  for (const tag of input.tags) {
    statements.push(db.prepare("INSERT OR IGNORE INTO tags(name) VALUES (?)").bind(tag));
    statements.push(db.prepare("INSERT INTO resource_tags(resource_id, tag_id) SELECT ?, id FROM tags WHERE name = ? COLLATE NOCASE").bind(id, tag));
  }
  await db.batch(statements);
}
