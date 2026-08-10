import type { AgeBand } from "./context/AudienceContext";

export type ResourceType = "Game" | "Video" | "Worksheet" | "Book" | "Website";
export type ResourceStatus = "draft" | "published" | "archived";

export interface Resource {
  id: string; title: string; description: string; subject: string; date: string;
  type: ResourceType; thumbnail: string; downloadUrl: string; rating: number; tags: string[];
  ageBands: AgeBand[]; studentIds: string[]; groupIds: string[];
  featured: boolean; status: ResourceStatus;
}

export interface ResourceInput {
  id?: string; title: string; description: string; subject: string; date?: string;
  type?: ResourceType; thumbnail: string; downloadUrl?: string; path?: string;
  rating?: number; tags?: string[]; ageBands?: AgeBand[]; studentIds?: string[];
  groupIds?: string[]; featured?: boolean; status?: ResourceStatus;
}

export enum ViewMode { Grid = "grid", List = "list" }
