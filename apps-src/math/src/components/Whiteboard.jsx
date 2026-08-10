import React, { useEffect, useRef, useState } from 'react';

export default function Whiteboard(){
  const canvasRef=useRef(null); const wrapRef=useRef(null);
  const [tool,setTool]=useState('pen'); const [grid,setGrid]=useState(true); const [history,setHistory]=useState([]); const [redo,setRedo]=useState([]);
  const drawing=useRef(false); const start=useRef(null); const snapshot=useRef(null);

  const resize=()=>{
    const canvas=canvasRef.current, wrap=wrapRef.current; if(!canvas||!wrap)return;
    const old=canvas.toDataURL(); const ratio=window.devicePixelRatio||1;
    canvas.width=wrap.clientWidth*ratio; canvas.height=520*ratio; canvas.style.width=wrap.clientWidth+'px'; canvas.style.height='520px';
    const ctx=canvas.getContext('2d'); ctx.scale(ratio,ratio); drawBackground(ctx,wrap.clientWidth,520,grid);
    const img=new Image(); img.onload=()=>ctx.drawImage(img,0,0,wrap.clientWidth,520); img.src=old;
  };
  useEffect(()=>{ resize(); window.addEventListener('resize',resize); return()=>window.removeEventListener('resize',resize); },[]);
  useEffect(()=>{ redrawFromHistory(); },[grid]);

  function drawBackground(ctx,w,h,showGrid){
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,w,h);
    if(showGrid){ ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=1; for(let x=0;x<w;x+=25){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()} for(let y=0;y<h;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()} }
  }
  function pos(e){ const r=canvasRef.current.getBoundingClientRect(); const p=e.touches?.[0]||e; return {x:p.clientX-r.left,y:p.clientY-r.top}; }
  function saveState(){ setHistory(h=>[...h,canvasRef.current.toDataURL()]); setRedo([]); }
  function redrawFromHistory(src){ const canvas=canvasRef.current,ctx=canvas.getContext('2d'),w=canvas.clientWidth,h=canvas.clientHeight; drawBackground(ctx,w,h,grid); const data=src || history.at(-1); if(data){ const img=new Image(); img.onload=()=>{drawBackground(ctx,w,h,grid);ctx.drawImage(img,0,0,w,h)}; img.src=data; } }
  function down(e){ e.preventDefault(); drawing.current=true; start.current=pos(e); const ctx=canvasRef.current.getContext('2d'); snapshot.current=ctx.getImageData(0,0,canvasRef.current.width,canvasRef.current.height); if(tool==='text'){ const text=prompt('Enter text'); if(text){ctx.fillStyle='#0f172a';ctx.font='20px system-ui';ctx.fillText(text,start.current.x,start.current.y);saveState()} drawing.current=false; } else {ctx.beginPath();ctx.moveTo(start.current.x,start.current.y);} }
  function move(e){ if(!drawing.current)return; e.preventDefault(); const p=pos(e),ctx=canvasRef.current.getContext('2d'); ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=tool==='eraser'?'#fff':'#0f172a';ctx.lineWidth=tool==='eraser'?22:3;
    if(e.shiftKey || tool==='line'){ ctx.putImageData(snapshot.current,0,0); ctx.beginPath();ctx.moveTo(start.current.x,start.current.y);ctx.lineTo(p.x,p.y);ctx.stroke(); }
    else {ctx.lineTo(p.x,p.y);ctx.stroke();}
  }
  function up(){ if(!drawing.current)return; drawing.current=false; saveState(); }
  function undo(){ if(history.length<2){clear();return} const current=history.at(-1); const next=history.slice(0,-1); setHistory(next);setRedo(r=>[current,...r]);redrawFromHistory(next.at(-1)); }
  function redoIt(){ if(!redo.length)return; const src=redo[0];setRedo(redo.slice(1));setHistory(h=>[...h,src]);redrawFromHistory(src); }
  function clear(){ const c=canvasRef.current,ctx=c.getContext('2d');drawBackground(ctx,c.clientWidth,c.clientHeight,grid);setHistory([]);setRedo([]); }
  function download(){ const link=document.createElement('a');link.download='precalculus-whiteboard.png';link.href=canvasRef.current.toDataURL('image/png');link.click(); }

  return <section className="tool-card"><div className="tool-heading"><div><span className="eyebrow">Workspace</span><h2>Digital Whiteboard</h2><p>Draw freely, hold Shift for straight lines, add text, toggle graph paper, and export your work.</p></div></div>
    <div className="toolbar">
      <button className={tool==='pen'?'active':''} onClick={()=>setTool('pen')}>✎ Pen</button>
      <button className={tool==='line'?'active':''} onClick={()=>setTool('line')}>／ Line</button>
      <button className={tool==='eraser'?'active':''} onClick={()=>setTool('eraser')}>⌫ Eraser</button>
      <button className={tool==='text'?'active':''} onClick={()=>setTool('text')}>T Text</button>
      <button className={grid?'active':''} onClick={()=>setGrid(!grid)}>▦ Graph paper</button>
      <button onClick={undo}>↶ Undo</button><button onClick={redoIt}>↷ Redo</button>
      <button onClick={clear}>× Clear</button><button onClick={download}>⇩ Save PNG</button>
    </div>
    <div className="canvas-wrap" ref={wrapRef}><canvas ref={canvasRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up}/></div>
  </section>
}
