import React,{useMemo,useState} from 'react';
const W=620,H=380,min=-8,max=8,sx=x=>(x-min)/(max-min)*W,sy=y=>H-(y-min)/(max-min)*H;
export default function InverseTool(){
 const [m,setM]=useState(2),[b,setB]=useState(1);
 const p1=`M ${sx(min)} ${sy(m*min+b)} L ${sx(max)} ${sy(m*max+b)}`;
 const invM=1/m, invB=-b/m;
 const p2=`M ${sx(min)} ${sy(invM*min+invB)} L ${sx(max)} ${sy(invM*max+invB)}`;
 const grid=useMemo(()=>{const a=[];for(let i=min;i<=max;i++){a.push(<line key={'x'+i} x1={sx(i)} x2={sx(i)} y1="0" y2={H} className={i===0?'axis':'grid'}/>);a.push(<line key={'y'+i} x1="0" x2={W} y1={sy(i)} y2={sy(i)} className={i===0?'axis':'grid'}/>)}return a},[]);
 return <section className="tool-card"><div className="tool-heading"><div><span className="eyebrow">Interactive tool</span><h2>Inverse Reflection Lab</h2><p>Adjust a linear function and compare it with its inverse across y = x.</p></div></div>
 <div className="explorer-grid"><div className="controls"><label>Slope m<div className="range-row"><input type="range" min="-4" max="4" step="0.25" value={m} onChange={e=>setM(Number(e.target.value)||.25)}/><output>{m}</output></div></label><label>Intercept b<div className="range-row"><input type="range" min="-5" max="5" step="0.5" value={b} onChange={e=>setB(Number(e.target.value))}/><output>{b}</output></div></label><div className="formula">f(x) = {m}x + {b}</div><div className="formula">f⁻¹(x) = {(1/m).toFixed(2)}x + {(-b/m).toFixed(2)}</div><ol className="steps"><li>Write y = mx + b.</li><li>Swap x and y.</li><li>Solve for y.</li></ol></div>
 <div className="graph-wrap"><svg viewBox={`0 0 ${W} ${H}`}>{grid}<line x1={sx(min)} y1={sy(min)} x2={sx(max)} y2={sy(max)} className="mirror"/><path d={p1} className="transform-path"/><path d={p2} className="inverse-path"/></svg><div className="legend"><span><i className="transform-dot"/>f</span><span><i className="inverse-dot"/>f⁻¹</span><span><i className="mirror-dot"/>y=x</span></div></div></div></section>
}
