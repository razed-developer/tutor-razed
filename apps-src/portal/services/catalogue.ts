import { RESOURCES } from "../constants";
import type { Resource, Student, StudentGroup } from "../types";

const readError = async (response: Response) => {
  try { return (await response.json()).error || response.statusText; }
  catch { return response.statusText || "Request failed"; }
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "content-type": "application/json", ...options?.headers },
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<T>;
}

export async function loadPublicResources(): Promise<Resource[]> {
  try {
    const data = await request<{ resources: Resource[] }>("/api/resources");
    return data.resources.length ? data.resources : RESOURCES;
  } catch { return RESOURCES; }
}

export const adminApi = {
  resources: () => request<{ resources: Resource[] }>("/api/admin/resources"),
  audiences: () => request<{ students: Student[]; groups: StudentGroup[] }>("/api/admin/audiences"),
  createResource: (resource: Partial<Resource>) => request<{ id: string }>("/api/admin/resources", { method: "POST", body: JSON.stringify(resource) }),
  updateResource: (id: string, resource: Partial<Resource>) => request<{ id: string }>(`/api/admin/resources/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(resource) }),
  archiveResource: (id: string) => request<{ id: string }>(`/api/admin/resources/${encodeURIComponent(id)}`, { method: "DELETE" }),
  saveStudent: (student: Partial<Student>) => request<{ id: string }>("/api/admin/students", { method: "POST", body: JSON.stringify(student) }),
  saveGroup: (group: Partial<StudentGroup>) => request<{ id: string }>("/api/admin/groups", { method: "POST", body: JSON.stringify(group) }),
};
