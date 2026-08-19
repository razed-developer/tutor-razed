import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAudience } from "../context/AudienceContext";
import { storyApi } from "../services/catalogue";
import type { Story } from "../types";

const Stories: React.FC = () => {
  const { ageBand } = useAudience(); const [stories, setStories] = useState<Story[]>([]); const [loading, setLoading] = useState(true); const [query, setQuery] = useState("");
  useEffect(() => { storyApi.list().then((data) => setStories(data.stories)).finally(() => setLoading(false)); }, []);
  const visible = useMemo(() => stories.filter((story) => story.ageBands.includes(ageBand) && `${story.title} ${story.author}`.toLowerCase().includes(query.toLowerCase())), [stories, ageBand, query]);
  return <div className="reading-library"><section className="reading-hero"><div><p className="eyebrow light">Reading Library</p><h1>Stories, one comfortable page at a time.</h1><p>Read independently, listen to a passage, or tap any word to hear it aloud.</p></div></section><main className="story-shell"><div className="story-toolbar"><label><span>Find a story</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title or author…"/></label><p>{visible.length} {visible.length === 1 ? "story" : "stories"} for your grade range</p></div>{loading ? <div className="story-empty">Opening the library…</div> : visible.length ? <div className="story-grid">{visible.map((story) => <Link className="story-card" to={`/stories/${story.id}`} key={story.id}><div className="story-cover">{story.coverImage ? <img src={story.coverImage} alt=""/> : <span aria-hidden="true">Aa</span>}</div><div><p className="eyebrow">{story.readingLevel || "Read at your pace"}</p><h2>{story.title}</h2><p className="story-author">by {story.author}</p><p>{story.description}</p><small>{story.passageCount} passages · {story.wordCount} words</small><strong>Start reading →</strong></div></Link>)}</div> : <div className="story-empty"><h2>No stories here yet</h2><p>Try another grade range or search.</p></div>}</main></div>;
};
export default Stories;
