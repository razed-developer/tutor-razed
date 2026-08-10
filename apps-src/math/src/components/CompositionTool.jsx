import React,{useState} from 'react';
const options={
  linear:{name:'3x − 2',fn:x=>3*x-2}, square:{name:'x²',fn:x=>x*x}, abs:{name:'|x|',fn:x=>Math.abs(x)}, sqrt:{name:'√x',fn:x=>x>=0?Math.sqrt(x):NaN}
};
export default function CompositionTool(){
 const [inner,setInner]=useState('linear'),[outer,setOuter]=useState('sqrt'),[x,setX]=useState(3);
 const g=options[inner],f=options[outer],gx=g.fn(x),result=f.fn(gx);
 return <section className="tool-card"><div className="tool-heading"><div><span className="eyebrow">Interactive tool</span><h2>Composition Machine</h2><p>Send a value through the inner function first, then the outer function.</p></div></div>
 <div className="composition-grid"><div className="machine"><label>Input x<input type="number" value={x} onChange={e=>setX(Number(e.target.value))}/></label><div className="pipe">x = {x}</div><label>Inner function g<select value={inner} onChange={e=>setInner(e.target.value)}>{Object.entries(options).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}</select></label><div className="pipe">g({x}) = {Number.isFinite(gx)?gx.toFixed(2):'undefined'}</div><label>Outer function f<select value={outer} onChange={e=>setOuter(e.target.value)}>{Object.entries(options).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}</select></label><div className="result">f(g({x})) = {Number.isFinite(result)?result.toFixed(3):'undefined'}</div></div>
 <div className="lesson-note"><h3>Recognize the nesting</h3><p>The composition <strong>f(g(x))</strong> means “apply g first, then apply f.”</p><p>For <strong>y = √(3x − 2)</strong>:</p><ul><li>Inner: g(x) = 3x − 2</li><li>Outer: f(x) = √x</li></ul><p>Domain check: the inner output must satisfy 3x − 2 ≥ 0.</p></div></div></section>
}
