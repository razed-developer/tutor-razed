import React, { useMemo, useState } from 'react';
import { parentFunctions } from '../data/topics';

const W=720,H=420,XMIN=-10,XMAX=10,YMIN=-8,YMAX=8;
const sx=x=>(x-XMIN)/(XMAX-XMIN)*W;
const sy=y=>H-(y-YMIN)/(YMAX-YMIN)*H;

function pathFor(fn, transform){
  const {a,k,d,c}=transform;
  let path=''; let drawing=false;
  for(let i=0;i<=1200;i++){
    const x=XMIN+(XMAX-XMIN)*i/1200;
    const inner=k*(x-d);
    const base=fn(inner);
    if(base===null || !Number.isFinite(base)){ drawing=false; continue; }
    const y=a*base+c;
    if(y<YMIN*4 || y>YMAX*4 || !Number.isFinite(y)){ drawing=false; continue; }
    path += `${drawing?'L':'M'} ${sx(x).toFixed(2)} ${sy(y).toFixed(2)} `;
    drawing=true;
  }
  return path;
}

export default function GraphExplorer(){
  const [selected,setSelected]=useState('absolute');
  const [t,setT]=useState({a:1,k:1,d:0,c:0});
  const parent=parentFunctions.find(p=>p.id===selected);
  const basePath=useMemo(()=>pathFor(parent.fn,{a:1,k:1,d:0,c:0}),[parent]);
  const transformed=useMemo(()=>pathFor(parent.fn,t),[parent,t]);
  const grid=[];
  for(let x=-10;x<=10;x++) grid.push(<line key={'x'+x} x1={sx(x)} x2={sx(x)} y1="0" y2={H} className={x===0?'axis':'grid'}/>);
  for(let y=-8;y<=8;y++) grid.push(<line key={'y'+y} x1="0" x2={W} y1={sy(y)} y2={sy(y)} className={y===0?'axis':'grid'}/>);
  return <section className="tool-card">
    <div className="tool-heading"><div><span className="eyebrow">Interactive tool</span><h2>Transformation Explorer</h2></div><button className="ghost" onClick={()=>setT({a:1,k:1,d:0,c:0})}>Reset</button></div>
    <div className="explorer-grid">
      <div className="controls">
        <label>Parent function<select value={selected} onChange={e=>setSelected(e.target.value)}>{parentFunctions.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select></label>
        {[['a','Vertical scale / x-reflection',-4,4,.25],['k','Horizontal scale / y-reflection',-4,4,.25],['d','Horizontal translation',-6,6,.5],['c','Vertical translation',-6,6,.5]].map(([key,label,min,max,step])=><label key={key}>{label}<div className="range-row"><input type="range" min={min} max={max} step={step} value={t[key]} onChange={e=>setT({...t,[key]:Number(e.target.value) || 0.01})}/><output>{t[key]}</output></div></label>)}
        <div className="formula">y = {t.a} · f({t.k}(x − {t.d})) + {t.c}</div>
        <div className="facts"><strong>{parent.label}</strong><span>Parent: {parent.formula}</span><span>Domain: {parent.domain}</span><span>Range: {parent.range}</span></div>
      </div>
      <div className="graph-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Interactive transformed graph">
          {grid}
          <path d={basePath} className="parent-path"/>
          <path d={transformed} className="transform-path"/>
        </svg>
        <div className="legend"><span><i className="parent-dot"/>Parent</span><span><i className="transform-dot"/>Transformed</span></div>
      </div>
    </div>
  </section>
}
