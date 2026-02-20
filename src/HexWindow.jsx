import { useRef, useState } from 'react'

export default function HexWindow({ title, children, onClose, onFocus, z = 0, isFocused = false }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ x: 120, y: 80 })
  const [size, setSize] = useState({ w: 420, h: 360 })
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })

  function onTitlePointerDown(e) {
    e.stopPropagation()
    onFocus?.()
    dragging.current = true
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  function onPointerMove(e) {
    if (!dragging.current) return
    
    // Add boundary checking to prevent dragging off screen
    const maxX = window.innerWidth - size.w
    const maxY = window.innerHeight - size.h
    const newX = Math.max(0, Math.min(maxX, e.clientX - dragStart.current.x))
    const newY = Math.max(0, Math.min(maxY, e.clientY - dragStart.current.y))
    
    setPos({ x: newX, y: newY })
  }

  function onPointerUp() {
    dragging.current = false
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
  }

  // pointer-based resize handler on bottom-right corner
  function onResizePointerDown(e) {
    e.stopPropagation()
    onFocus?.()
    const start = { x: e.clientX, y: e.clientY, w: size.w, h: size.h }
    function move(ev) {
      const newW = Math.max(220, start.w + (ev.clientX - start.x))
      const newH = Math.max(160, start.h + (ev.clientY - start.y))
      setSize({ w: newW, h: newH })
    }
    function up() {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // Handle close button click
  function handleClose(e) {
    e.stopPropagation()
    onClose()
  }

  // Handle window click (but not for close/resize buttons)
  function handleWindowClick(e) {
    // Only focus if not clicking close or resize
    if (!e.target.closest('.hex-close') && !e.target.closest('.hex-resize')) {
      onFocus?.()
    }
  }

  return (
    <div
      ref={ref}
      className={`hex-window ${isFocused ? 'focused' : ''}`}
      onPointerDown={handleWindowClick}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, width: size.w, height: size.h, zIndex: z }}
    >
      <div className="hex-frame">
        <div className="hex-titlebar" onPointerDown={onTitlePointerDown}>
          <span className="hex-title">{title}</span>
        </div>

        {/* Close button positioned within hexagon visible area */}
        <button
          type="button"
          className="hex-close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="hex-content">{children}</div>

        {/* Resize handle positioned within hexagon visible area */}
        <div className="hex-resize" onPointerDown={onResizePointerDown} />
      </div>
    </div>
  )
}