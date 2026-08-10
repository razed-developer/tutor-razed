import React, { useMemo, useState } from "react";
import { RESOURCES, SUBJECTS } from "../constants";
import ResourceCard from "../components/ResourceCard";
import { useAudience } from "../context/AudienceContext";

const Resources: React.FC = () => {
  const initial = new URLSearchParams(location.hash.split("?")[1]).get("subject") || "All";
  const [query, setQuery] = useState(""); const [subject, setSubject] = useState(initial);
  const { ageBand, label } = useAudience();
  const resources = useMemo(() => RESOURCES.filter((r) => r.ageBands.includes(ageBand) && (subject === "All" || r.subject === subject) && `${r.title} ${r.description} ${r.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query, subject, ageBand]);
  return <main className="library-page"><header className="library-hero"><p className="eyebrow light">Collection · {label}</p><h1>Find your next resource</h1><p>Search the shoreline or filter by subject.</p></header><section className="library-shell">
    <div className="filters"><label><span>Search</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try fractions, writing, graphs…"/></label><div className="chips">{SUBJECTS.map((s) => <button key={s} className={subject === s ? "active" : ""} onClick={() => setSubject(s)}>{s}</button>)}</div></div>
    <div className="results-line"><strong>{resources.length} resources</strong><span>Selected for {label}</span></div>
    {resources.length ? <div className="resource-grid">{resources.map((r) => <ResourceCard key={r.id} resource={r}/>)}</div> : <div className="empty-state"><h2>Nothing washed ashore.</h2><p>Try another search or subject.</p><button onClick={() => { setQuery(""); setSubject("All"); }}>Clear filters</button></div>}
  </section></main>;
};
export default Resources;
