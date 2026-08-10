import React from "react";
import ResourceCard from "../components/ResourceCard";
import { AGE_BANDS, AGE_LABELS, useAudience } from "../context/AudienceContext";
import { useResources } from "../hooks/useResources";

const voice = {
  k4: { kicker: "Forest Trailhead", title: "Big adventures start with one curious click.", body: "Choose a trail, meet something new, and collect ideas along the way.", action: "Pick an adventure" },
  "5-8": { kicker: "Tidepool Explorer", title: "Follow your curiosity.", body: "Games, tools, stories, and challenges—collected for curious minds on the coast.", action: "Dive into the collection" },
  "9-12": { kicker: "Coastal Field Guide", title: "Explore deeply. Build confidently.", body: "A focused collection of tools and resources for coursework, projects, and independent learning.", action: "Browse the field guide" }
};

const Home: React.FC = () => {
  const { ageBand, setAgeBand } = useAudience();
  const resources = useResources();
  const copy = voice[ageBand];
  const visible = resources.filter((r) => r.ageBands.includes(ageBand));
  const featured = visible.filter((r) => r.featured).slice(0, 3);
  return <div className="portal-page">
    <section className="hero">
      <div className="coast-layer" aria-hidden="true"><span className="mountain one"/><span className="mountain two"/><span className="island"/><span className="wave w1"/><span className="wave w2"/></div>
      <div className="hero-inner">
        <p className="eyebrow light">{copy.kicker}</p><h1>{copy.title}</h1><p className="hero-copy">{copy.body}</p>
        <div className="age-picker"><p>Choose your learning current</p><div>{AGE_BANDS.map((band) => <button key={band} onClick={() => setAgeBand(band)} className={ageBand === band ? "active" : ""}><strong>{AGE_LABELS[band]}</strong><small>{band === "k4" ? "Play & discover" : band === "5-8" ? "Explore & create" : "Study & build"}</small></button>)}</div></div>
        <a className="primary-button" href="/resources">{copy.action} <span>→</span></a>
      </div>
    </section>

    <main className="content-shell">
      <section className="welcome-panel"><div><p className="eyebrow">Your current · {AGE_LABELS[ageBand]}</p><h2>{ageBand === "k4" ? "Ready, trailblazer?" : ageBand === "5-8" ? "What will you find today?" : "Your next idea starts here."}</h2></div><p>Everything shown is selected for this grade range. Change the current whenever you need a different challenge.</p></section>
      <section className="section-block"><div className="section-heading"><div><p className="eyebrow">Hand-picked</p><h2>Featured for you</h2></div><a href="/resources">See the whole collection →</a></div><div className="featured-grid">{featured.map((r) => <ResourceCard key={r.id} resource={r}/>)}</div></section>
      <section className="section-block"><div className="section-heading"><div><p className="eyebrow">Choose a route</p><h2>Explore by subject</h2></div></div><div className="subject-grid">
        <a href="/resources?subject=Math"><b>△</b><span><strong>Math</strong><small>Patterns, puzzles & graphs</small></span></a>
        <a href="/resources?subject=Writing"><b>✎</b><span><strong>Language Arts</strong><small>Stories, words & ideas</small></span></a>
        <a href="/resources?subject=Science"><b>⌁</b><span><strong>Science</strong><small>Observe, test & discover</small></span></a>
        <a href="/resources"><b>✦</b><span><strong>Games & Tools</strong><small>Learn by doing</small></span></a>
      </div></section>
    </main>
    <footer><span>Tutor Portal</span><p>Learning resources from the edge of the Pacific.</p><a href="/admin">Admin</a></footer>
  </div>;
};
export default Home;
