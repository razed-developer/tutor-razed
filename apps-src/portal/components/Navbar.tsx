import React, { useState } from "react";
import { AGE_BANDS, AGE_LABELS, useAudience } from "../context/AudienceContext";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { ageBand, setAgeBand } = useAudience();
  return <header className="site-header">
    <a className="brand" href="#/" aria-label="Tutor Portal home"><span className="orca">◒</span><span>Tutor Portal</span></a>
    <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
    <nav className={open ? "site-nav open" : "site-nav"}>
      <a href="#/">Home</a><a href="#/resources">Explore</a><a href="/math/">Math Lab</a>
    </nav>
    <div className="mini-age-switch" aria-label="Choose grade range">
      {AGE_BANDS.map((band) => <button key={band} className={band === ageBand ? "active" : ""} onClick={() => setAgeBand(band)}>{AGE_LABELS[band]}</button>)}
    </div>
  </header>;
};
export default Navbar;
