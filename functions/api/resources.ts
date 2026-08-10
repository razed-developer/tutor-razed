import { handleError, json, requireDatabase, type Env } from "../_shared/http";
import { listResources } from "../_shared/resources";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    requireDatabase(env);
    return json({ resources: await listResources(env, true) });
  } catch (error) { return handleError(error); }
};
