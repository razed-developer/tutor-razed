import React from "react";
import { Resource } from "../types";

const ResourceCard: React.FC<{ resource: Resource; onClick?: (id: string) => void }> = ({ resource, onClick }) => (
  <article className={`resource-card subject-${resource.subject.toLowerCase().replace(/\W/g, "")}`} onClick={() => onClick?.(resource.id)}>
    <div className="resource-image"><img src={resource.thumbnail} alt="" loading="lazy"/><span>{resource.subject}</span></div>
    <div className="resource-copy"><p className="eyebrow">{resource.type} · {resource.ageBands.map(x => x === "k4" ? "K–4" : x).join(", ")}</p>
      <h3>{resource.title}</h3><p>{resource.description}</p>
      <div className="card-foot"><span>{resource.tags.slice(0, 2).join(" · ")}</span><a href={resource.downloadUrl}>Open <span aria-hidden="true">→</span></a></div>
    </div>
  </article>
);
export default ResourceCard;
