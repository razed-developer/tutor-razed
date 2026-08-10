import React, { useEffect, useMemo, useState } from "react";
import { AGE_BANDS, AGE_LABELS } from "../context/AudienceContext";
import { adminApi } from "../services/catalogue";
import type { Resource, ResourceStatus, ResourceType, Student, StudentGroup } from "../types";

const emptyResource = (): Resource => ({
  id: "", title: "", description: "", subject: "", date: "", type: "Website", thumbnail: "",
  downloadUrl: "", rating: 0, tags: [], ageBands: ["k4", "5-8", "9-12"], studentIds: [],
  groupIds: [], featured: false, status: "draft", sortOrder: 0,
});

const Admin: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]); const [students, setStudents] = useState<Student[]>([]); const [groups, setGroups] = useState<StudentGroup[]>([]);
  const [draft, setDraft] = useState<Resource>(emptyResource()); const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [message, setMessage] = useState(""); const [error, setError] = useState("");

  const reload = async (preferredId?: string) => {
    setLoading(true); setError("");
    try {
      const [resourceData, audienceData] = await Promise.all([adminApi.resources(), adminApi.audiences()]);
      setResources(resourceData.resources); setStudents(audienceData.students); setGroups(audienceData.groups);
      const next = resourceData.resources.find((item) => item.id === preferredId) || resourceData.resources[0] || emptyResource(); setDraft({ ...next });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load admin data"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void reload(); }, []);
  const filtered = useMemo(() => resources.filter((item) => `${item.title} ${item.subject} ${item.type}`.toLowerCase().includes(query.toLowerCase())), [resources, query]);
  const change = <K extends keyof Resource>(key: K, value: Resource[K]) => setDraft((old) => ({ ...old, [key]: value }));
  const toggle = (key: "ageBands" | "studentIds" | "groupIds", value: string) => change(key, (draft[key].includes(value) ? draft[key].filter((item) => item !== value) : [...draft[key], value]) as never);

  const save = async (status: ResourceStatus) => {
    setSaving(true); setError(""); setMessage("");
    try {
      const payload = { ...draft, status, url: draft.downloadUrl };
      const result = draft.id ? await adminApi.updateResource(draft.id, payload) : await adminApi.createResource(payload);
      setMessage(status === "published" ? "Resource published." : "Draft saved."); await reload(result.id);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Save failed"); }
    finally { setSaving(false); }
  };
  const archive = async () => { if (!draft.id || !confirm(`Archive “${draft.title}”?`)) return; setSaving(true); try { await adminApi.archiveResource(draft.id); setMessage("Resource archived."); await reload(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Archive failed"); } finally { setSaving(false); } };
  const addStudent = async () => { const displayName = prompt("Student display name"); if (!displayName?.trim()) return; try { await adminApi.saveStudent({ displayName, active: true }); await reload(draft.id); setMessage("Student added."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add student"); } };
  const addGroup = async () => { const name = prompt("Group name"); if (!name?.trim()) return; try { await adminApi.saveGroup({ name, active: true, studentIds: [] }); await reload(draft.id); setMessage("Group added."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add group"); } };

  return <main className="admin-page"><aside className="admin-sidebar"><a className="brand" href="/"><span className="orca">◒</span><span>Tutor Razed</span></a><p>ADMIN</p><nav><button className="active">▦ Resources</button><button onClick={addStudent}>♙ Add student</button><button onClick={addGroup}>♧ Add group</button></nav><a href="/">← Return to site</a></aside>
    <section className="admin-main"><header><div><p className="eyebrow">Content studio</p><h1>Resources</h1></div><button className="primary-button" onClick={() => { setDraft(emptyResource()); setMessage(""); }}>+ Add resource</button></header>
      {error && <div className="admin-notice error"><strong>Admin unavailable</strong><span>{error}</span></div>}{message && <div className="admin-notice success"><strong>Success</strong><span>{message}</span></div>}
      {loading ? <div className="admin-loading">Loading protected content…</div> : <div className="admin-workspace"><div className="resource-list"><label><span>Search resources</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search…"/></label>{filtered.map((resource) => <button className={draft.id === resource.id ? "active" : ""} key={resource.id} onClick={() => { setDraft({ ...resource }); setMessage(""); }}><img src={resource.thumbnail || "/favicon.svg"} alt=""/><span><strong>{resource.title}</strong><small>{resource.subject} · {resource.status}</small></span></button>)}</div>
        <form className="editor" onSubmit={(event) => { event.preventDefault(); void save("published"); }}><div className="editor-head"><div><p className="eyebrow">{draft.id ? "Edit resource" : "New resource"}</p><h2>{draft.title || "Untitled resource"}</h2></div><span className={`status ${draft.status}`}>{draft.status}</span></div>
          <label>Title<input required value={draft.title} onChange={(event) => change("title", event.target.value)}/></label><label>Description<textarea value={draft.description} onChange={(event) => change("description", event.target.value)}/></label>
          <div className="form-row"><label>Subject<input required value={draft.subject} onChange={(event) => change("subject", event.target.value)}/></label><label>Type<select value={draft.type} onChange={(event) => change("type", event.target.value as ResourceType)}>{["Game","Website","Worksheet","Book","Video"].map((type) => <option key={type}>{type}</option>)}</select></label></div>
          <label>Resource URL<input required type="url" value={draft.downloadUrl} onChange={(event) => change("downloadUrl", event.target.value)} placeholder="https://…"/></label><label>Image URL<input type="url" value={draft.thumbnail} onChange={(event) => change("thumbnail", event.target.value)} placeholder="https://…"/></label>
          <div className="form-row"><label>Tags<input value={draft.tags.join(", ")} onChange={(event) => change("tags", event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean))} placeholder="fractions, game"/></label><label>Display order<input type="number" value={draft.sortOrder || 0} onChange={(event) => change("sortOrder", Number(event.target.value))}/></label></div>
          <label className="inline-check"><input type="checkbox" checked={draft.featured} onChange={(event) => change("featured", event.target.checked)}/><span>Feature this resource on the landing page</span></label>
          <fieldset><legend>Visible to grade ranges</legend><div className="check-grid">{AGE_BANDS.map((band) => <label key={band}><input type="checkbox" checked={draft.ageBands.includes(band)} onChange={() => toggle("ageBands", band)}/><span><strong>{AGE_LABELS[band]}</strong><small>{band === "k4" ? "Primary" : band === "5-8" ? "Middle years" : "Secondary"}</small></span></label>)}</div></fieldset>
          <fieldset><legend>Specific students and groups</legend><p className="field-help">Leave both empty for everyone in the selected grade ranges. Selecting anyone makes this resource private to those assignments.</p><div className="assignment-columns"><div><div className="assignment-title"><strong>Students</strong><button type="button" onClick={addStudent}>+ Add</button></div>{students.filter((item) => item.active).map((student) => <label className="assignment" key={student.id}><input type="checkbox" checked={draft.studentIds.includes(student.id)} onChange={() => toggle("studentIds", student.id)}/>{student.displayName}</label>)}</div><div><div className="assignment-title"><strong>Groups</strong><button type="button" onClick={addGroup}>+ Add</button></div>{groups.filter((item) => item.active).map((group) => <label className="assignment" key={group.id}><input type="checkbox" checked={draft.groupIds.includes(group.id)} onChange={() => toggle("groupIds", group.id)}/>{group.name}</label>)}</div></div></fieldset>
          <div className="editor-actions">{draft.id && <button type="button" className="danger-button" disabled={saving} onClick={archive}>Archive</button>}<button type="button" disabled={saving} onClick={() => void save("draft")}>Save draft</button><button className="primary-button" disabled={saving}>{saving ? "Saving…" : "Publish changes"}</button></div>
        </form></div>}
    </section></main>;
};
export default Admin;
