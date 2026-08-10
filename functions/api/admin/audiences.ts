import { handleError, json, requireAdmin, requireDatabase, type Env } from "../../_shared/http";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    requireAdmin(request, env); const db = requireDatabase(env);
    const [students, groups] = await Promise.all([
      db.prepare("SELECT id, display_name, active FROM students ORDER BY display_name").all(),
      db.prepare(`SELECT g.id,g.name,g.active,COALESCE(json_group_array(gs.student_id) FILTER (WHERE gs.student_id IS NOT NULL),'[]') student_ids
        FROM groups g LEFT JOIN group_students gs ON gs.group_id=g.id GROUP BY g.id ORDER BY g.name`).all(),
    ]);
    return json({
      students: students.results.map((row: any) => ({ id: row.id, displayName: row.display_name, active: Boolean(row.active) })),
      groups: groups.results.map((row: any) => ({ id: row.id, name: row.name, active: Boolean(row.active), studentIds: JSON.parse(row.student_ids) })),
    });
  } catch (error) { return handleError(error); }
};
