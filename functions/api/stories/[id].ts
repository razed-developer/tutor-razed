import { handleError, json, requireDatabase, type Env } from "../../_shared/http";
import { getStory } from "../../_shared/stories";
export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => { try { requireDatabase(env); const story = await getStory(env, String(params.id), true); return story ? json({ story }) : json({ error: "Story not found" }, 404); } catch (error) { return handleError(error); } };
