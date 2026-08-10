import { Resource, ResourceInput } from "./types";
import resourcesData from "./public/resources.json";

function normalizePath(path: string) {
  const value = path.trim();
  if (!value) return "#";
  if (/^(https?:|mailto:|tel:|#)/.test(value)) return value;
  return value.startsWith("/") ? value : `/${value}`;
}
function slugify(text: string) { return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
function toResource(input: ResourceInput, index: number): Resource {
  return {
    id: input.id?.trim() || `${slugify(input.title)}-${index + 1}`,
    title: input.title, description: input.description, subject: input.subject, date: input.date ?? "",
    type: input.type ?? "Website", thumbnail: input.thumbnail,
    downloadUrl: input.downloadUrl?.trim() || normalizePath(input.path ?? "#"),
    rating: input.rating ?? 0, tags: input.tags ?? [],
    ageBands: input.ageBands ?? ["k4", "5-8", "9-12"],
    studentIds: input.studentIds ?? [], groupIds: input.groupIds ?? [],
    featured: input.featured ?? index < 4, status: input.status ?? "published"
  };
}
const time = (value: string) => Number.isNaN(Date.parse(value)) ? 0 : Date.parse(value);
export const RESOURCES = (resourcesData as ResourceInput[]).map(toResource)
  .filter((item) => item.status === "published")
  .sort((a, b) => time(b.date) - time(a.date));
export const SUBJECTS = ["All", ...Array.from(new Set(RESOURCES.map((item) => item.subject).filter(Boolean)))];
export const MOCK_RESOURCES = RESOURCES;
