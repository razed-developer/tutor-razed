import { handleError, json, requireDatabase, type Env } from "../../_shared/http";
import { listStories } from "../../_shared/stories";
export const onRequestGet: PagesFunction<Env> = async ({ env }) => { try { requireDatabase(env); return json({ stories: await listStories(env, true) }); } catch (error) { return handleError(error); } };
