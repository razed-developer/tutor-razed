import React,{useState} from 'react';
import {topics} from './data/topics';
import GraphExplorer from './components/GraphExplorer';
import Whiteboard from './components/Whiteboard';
import InverseTool from './components/InverseTool';
import CompositionTool from './components/CompositionTool';

export default function App(){
 const [active,setActive]=useState('transformations'); const [menu,setMenu]=useState(false);
 const topic=topics.find(t=>t.id===active);
 return <div className="app-shell">
  <header><div className="brand"><div className="brand-mark">ƒ</div><div><strong>Pre-Calculus Lab</strong><span>Functions, relations & transformations</span></div></div><div className="header-actions"><a className="portal-link" href="/">← Tutor Portal</a><button className="menu-btn" onClick={()=>setMenu(!menu)} aria-label="Toggle course menu" aria-expanded={menu}>{menu?'×':'☰'}</button></div></header>
  <div className="layout"><aside className={menu?'open':''}><p className="nav-label">Course map</p>{topics.map(t=><button key={t.id} className={active===t.id?'nav-active':''} onClick={()=>{setActive(t.id);setMenu(false)}}><span>{t.title}</span><small>{t.blurb}</small></button>)}<div className="aside-note">✎ <span>Use the whiteboard in any lesson to sketch, annotate, or solve.</span></div></aside>
  <main>
    <section className="hero"><span className="eyebrow">Grade 12 Pre-Calculus</span><h1>{topic.title}</h1><p>{topic.blurb}</p><div className="hero-chips"><span>▤ Learn</span><span>◉ Explore</span><span>ƒ Practice</span><span>▧ Reflect</span></div></section>
    <section className="learn-do"><div className="learn-panel"><span className="panel-kicker">LEARN</span><h2>Core ideas</h2>{topic.learn.map((x,i)=><div className="concept" key={x}><b>{i+1}</b><p>{x}</p></div>)}</div><div className="do-panel"><span className="panel-kicker">DO</span><h2>Try these prompts</h2><ol><li>Describe the transformation in words.</li><li>Predict the graph before using a tool.</li><li>Check domain, range, intercepts, and asymptotes.</li><li>Explain how the equation encodes the graph.</li></ol></div></section>
    {(active==='transformations'||active==='parents')&&<GraphExplorer/>}
    {active==='inverses'&&<InverseTool/>}
    {active==='composition'&&<CompositionTool/>}
    {active==='operations'&&<section className="tool-card"><div className="tool-heading"><div><span className="eyebrow">Guided practice</span><h2>Operations on Functions</h2></div></div><div className="operation-cards">{['(f + g)(x)','(f − g)(x)','(fg)(x)','(f/g)(x)'].map((s,i)=><article key={s}><h3>{s}</h3><p>{['Add outputs','Subtract outputs','Multiply outputs','Divide outputs; exclude zeros of g'][i]}</p><div className="mini-task">Let f(x)=x² and g(x)=x−2. Find {s}.</div></article>)}</div></section>}
    <Whiteboard/>
  </main></div>
  <footer>Built for exploration, explanation, and visible mathematical thinking.</footer>
 </div>
}
