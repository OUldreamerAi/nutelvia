import { useRef, useState } from 'react'

export default function HexWindow({ title, children, onClose }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 120, y: 80 })
  const [size, setSize] = useState({ w: 420, h: 360 })
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  function onMouseDown(e) {
    dragging.current = true
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
  function onMouseMove(e) {
    if (!dragging.current) return
    setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }
  function onMouseUp() {
    dragging.current = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  // simple resize handler on bottom-right corner
  function onResizeMouseDown(e) {
    e.stopPropagation()
    const start = { x: e.clientX, y: e.clientY, w: size.w, h: size.h }
    function move(ev) {
      setSize({ w: Math.max(220, start.w + (ev.clientX - start.x)), h: Math.max(160, start.h + (ev.clientY - start.y)) })
    }
    function up() {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  return (
    <div
      ref={ref}
      className="hex-window"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, width: size.w, height: size.h }}
    >
      <div className="hex-frame">
        <div className="hex-titlebar" onMouseDown={onMouseDown}>
          <span className="hex-title">{title}</span>
          <button className="hex-close" onClick={onClose}>✕</button>
        </div>
        <div className="hex-content">
          {children}
        </div>
        <div className="hex-resize" onMouseDown={onResizeMouseDown} />
      </div>
    </div>
  )
}
