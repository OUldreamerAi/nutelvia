 import { useState, useEffect, useRef } from 'react';

const SZ = 16;
const initS = [{ x: 8, y: 8 }];
const initD = { x: 1, y: 0 };
const initF = { x: 4, y: 4 };

function newFood(s) {
  let f;
  do { f = { x: Math.floor(Math.random() * SZ), y: Math.floor(Math.random() * SZ) }; }
  while (s.some(a => a.x === f.x && a.y === f.y));
  return f;
}




export default function Snake() {
  const [s, setS] = useState(initS);
  const [d, setD] = useState(initD);
  const [f, setF] = useState(initF);
  const [dead, setDead] = useState(false);
  const [pts, setPts] = useState(0);
  const mv = useRef(d);

  useEffect(() => { mv.current = d; }, [d]);

  useEffect(() => {
    if (dead) return;
    const t = setInterval(() => {
      setS(prev => {
        const h = { x: prev[0].x + mv.current.x, y: prev[0].y + mv.current.y };
        if (h.x < 0 || h.x >= SZ || h.y < 0 || h.y >= SZ || prev.some(a => a.x === h.x && a.y === h.y)) {
          setDead(true);
          return prev;
        }
        const ns = [h, ...prev];
        if (h.x === f.x && h.y === f.y) { setF(newFood(ns)); setPts(p => p + 1); }
        else ns.pop();
        return ns;
      });
    }, 120);
    return () => clearInterval(t);
  }, [f, dead]);



  useEffect(() => {
    const kd = e => {
      if (dead) return;
      if (e.key === 'ArrowUp' && d.y !== 1) setD({ x: 0, y: -1 });
      else if (e.key === 'ArrowDown' && d.y !== -1) setD({ x: 0, y: 1 });
      else if (e.key === 'ArrowLeft' && d.x !== 1) setD({ x: -1, y: 0 });
      else if (e.key === 'ArrowRight' && d.x !== -1) setD({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', kd);
    return () => window.removeEventListener('keydown', kd);
  }, [d, dead]);

  const reset = () => { setS(initS); setD(initD); setF(initF); setDead(false); setPts(0); };


  return (
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: 8 }}>
        Score: {pts}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SZ}, 13px)`, gap: 1, background: '#222', borderRadius: 8, width: SZ*13+(SZ-1), height: SZ*13+(SZ-1) }}>
        {[...Array(SZ * SZ)].map((_, i) => {
          const x = i % SZ, y = Math.floor(i / SZ);
          const head = s[0].x === x && s[0].y === y;
          const body = s.some(a => a.x === x && a.y === y);
          const food = f.x === x && f.y === y;
          return <div key={i} style={{ width: 13, height: 13, background: head ? '#0f0' : body ? '#6f6' : food ? '#f33' : '#333', borderRadius: head || food ? '50%' : 4, border: head ? '1px solid #fff' : 'none' }} />;
        })}
      </div>
      {dead && <div style={{ marginTop: 10, textAlign: 'center' }}><div>Game Over!</div><button onClick={reset} style={{ marginTop: 6, padding: '5px 14px', borderRadius: 6 }}>Restart</button></div>}
    </div>
  );
}