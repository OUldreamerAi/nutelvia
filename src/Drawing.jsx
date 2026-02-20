import { useRef, useState } from 'react';

export default function Drawing() {
  const c = useRef(null);
  const [d, setD] = useState(false);

  function down(e) {
    setD(true);
    var ctx = c.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }

  function move(e) {
    if (!d) return;
    var ctx = c.current.getContext('2d');
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  }

  return (
    <div style={{ padding: 12 }}>
      <h3 style={{ fontSize: '18px', marginBottom: 8 }}>Drawing App</h3>
      <canvas
        ref={c}
        width={400}
        height={300}
        style={{ border: '1px solid #ffffff', borderRadius: 8 }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={() => setD(false)}
        onPointerLeave={() => setD(false)}
      />
    </div>
  );
}