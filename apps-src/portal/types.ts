import type { AgeBand } from "./context/AudienceContext";

export type ResourceType = "Game" | "Video" | "Worksheet" | "Book" | "Website";
export type ResourceStatus = "draft" | "published" | "archived";

export interface Resource {
  id: string; title: string; description: string; subject: string; date: string;
  type: ResourceType; thumbnail: string; downloadUrl: string; rating: number; tags: string[];
  ageBands: AgeBand[]; studentIds: string[]; groupIds: string[];
  featured: boolean; status: ResourceStatus;
  sortOrder?: number;
}

export interface Student { id: string; displayName: string; active: boolean; }
export interface StudentGroup { id: string; name: string; active: boolean; studentIds: string[]; }

export interface StoryPassage { number: number; text: string; wordCount: number; }
export interface Story {
  id: string; title: string; author: string; description: string; coverImage: string;
  readingLevel: string; sourceUrl: string; publicDomainNote: string; status: ResourceStatus;
  ageBands: AgeBand[]; chunkSize: number; passageCount?: number; wordCount?: number;
  publishedAt?: string; fullText?: string; passages?: StoryPassage[];
}

export interface ResourceInput {
  id?: string; title: string; description: string; subject: string; date?: string;
  type?: ResourceType; thumbnail: string; downloadUrl?: string; path?: string;
  rating?: number; tags?: string[]; ageBands?: AgeBand[]; studentIds?: string[];
  groupIds?: string[]; featured?: boolean; status?: ResourceStatus;
}

export enum ViewMode { Grid = "grid", List = "list" }
