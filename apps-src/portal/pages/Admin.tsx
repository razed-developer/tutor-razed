import React, { useState } from "react";
import { RESOURCES } from "../constants";
import { AGE_BANDS, AGE_LABELS, AgeBand } from "../context/AudienceContext";

const Admin: React.FC = () => {
  const [selected, setSelected] = useState(RESOURCES[0]);
  const [bands, setBands] = useState<AgeBand[]>(selected.ageBands);
  const toggle = (band: AgeBand) => setBands((old) => old.includes(band) ? old.filter((x) => x !== band) : [...old, band]);
  return <main className="admin-page"><aside className="admin-sidebar"><a className="brand" href="#/"><span className="orca">◒</span>Tutor Portal</a><p>ADMIN</p><nav><button className="active">▦ Resources</button><button>♙ Students</button><button>♧ Groups</button><button>◇ Subjects</button></nav><a href="#/">← Return to site</a></aside>
    <section className="admin-main"><header><div><p className="eyebrow">Content studio</p><h1>Resources</h1></div><button className="primary-button" onClick={() => alert("D1 publishing will activate after the Cloudflare database binding is added.")}>+ Add resource</button></header>
      <div className="admin-notice"><strong>Cloudflare connection required</strong><span>The editor UI and visibility model are ready. Add the D1 database binding and Access policy before changes can be published to every visitor.</span></div>
      <div className="admin-workspace"><div className="resource-list"><label><span>Search resources</span><input placeholder="Search…"/></label>{RESOURCES.map((r) => <button className={selected.id === r.id ? "active" : ""} key={r.id} onClick={() => { setSelected(r); setBands(r.ageBands); }}><img src={r.thumbnail} alt=""/><span><strong>{r.title}</strong><small>{r.subject} · {r.type}</small></span></button>)}</div>
        <form className="editor" onSubmit={(e) => e.preventDefault()}><div className="editor-head"><div><p className="eyebrow">Edit resource</p><h2>{selected.title}</h2></div><span className="status">Published</span></div>
          <label>Title<input defaultValue={selected.title}/></label><label>Description<textarea defaultValue={selected.description}/></label><div className="form-row"><label>Subject<input defaultValue={selected.subject}/></label><label>Type<select defaultValue={selected.type}><option>Game</option><option>Website</option><option>Worksheet</option><option>Book</option><option>Video</option></select></label></div>
          <fieldset><legend>Visible to grade ranges</legend><div className="check-grid">{AGE_BANDS.map((band) => <label key={band}><input type="checkbox" checked={bands.includes(band)} onChange={() => toggle(band)}/><span><strong>{AGE_LABELS[band]}</strong><small>{band === "k4" ? "Primary" : band === "5-8" ? "Middle years" : "Secondary"}</small></span></label>)}</div></fieldset>
          <fieldset><legend>Specific students and groups</legend><p className="field-help">Leave empty for everyone in the selected grade ranges, or narrow access with assignments.</p><div className="form-row"><label>Students<input placeholder="Search or add students…"/></label><label>Groups<input placeholder="Search or add groups…"/></label></div></fieldset>
          <div className="editor-actions"><button>Save draft</button><button className="primary-button" onClick={() => alert("Publishing is disabled until D1 and Cloudflare Access are configured.")}>Publish changes</button></div>
        </form></div>
    </section></main>;
};
export default Admin;
