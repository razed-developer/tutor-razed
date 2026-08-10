import { useEffect, useState } from "react";
import { RESOURCES } from "../constants";
import { loadPublicResources } from "../services/catalogue";

export function useResources() {
  const [resources, setResources] = useState(RESOURCES);
  useEffect(() => { let active = true; loadPublicResources().then((items) => { if (active) setResources(items); }); return () => { active = false; }; }, []);
  return resources;
}
