import { useState, useRef } from 'react'
import HexIcon from './HexIcon.jsx'
import HexWindow from './HexWindow.jsx'
import TicTacToe from './TicTacToe.jsx'

export default function Desktop() {
  // initial icon positions (px)
  const [icons, setIcons] = useState([
    { id: 'tictactoe', label: 'TicTacToe', x: 40, y: 40 },
    { id: 'drawing', label: 'Drawing', x: 200, y: 40 },
    { id: 'notebook', label: 'Notebook', x: 360, y: 40 },
    { id: 'games', label: 'Games', x: 520, y: 40 },
    { id: 'chat', label: 'Chatbot', x: 680, y: 40 },
  ])

  // windows with z-order
  const nextZ = useRef(100)
  const [windows, setWindows] = useState([])

  function openApp(appId, title, props = {}) {
    const win = { id: Date.now() + Math.random(), appId, title, props, z: ++nextZ.current, x: 120, y: 80 }
    setWindows(w => [...w, win])
  }

  function closeWindow(id) {
    setWindows(w => w.filter(x => x.id !== id))
  }

  function bringToFront(id) {
    setWindows(w => w.map(win => (win.id === id ? { ...win, z: ++nextZ.current } : win)))
  }

  // icon dragging state
  const dragging = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  function onIconPointerDown(e, icon) {
    e.preventDefault()
    // allow double-click to still fire on the inner button
    dragging.current = icon.id
    dragOffset.current = { x: e.clientX - icon.x, y: e.clientY - icon.y }
    window.addEventListener('pointermove', onIconPointerMove)
    window.addEventListener('pointerup', onIconPointerUp)
  }

  function onIconPointerMove(e) {
    const id = dragging.current
    if (!id) return
    const nx = Math.max(8, e.clientX - dragOffset.current.x)
    const ny = Math.max(8, e.clientY - dragOffset.current.y)
    setIcons(prev => prev.map(ic => (ic.id === id ? { ...ic, x: nx, y: ny } : ic)))
  }

  function onIconPointerUp() {
    dragging.current = null
    window.removeEventListener('pointermove', onIconPointerMove)
    window.removeEventListener('pointerup', onIconPointerUp)
  }

  return (
    <div className="desktop">
      <div className="icons-layer">
        {icons.map(icon => (
          <div
            key={icon.id}
            className="icon-absolute"
            style={{ transform: `translate(${icon.x}px, ${icon.y}px)` }}
            onPointerDown={e => onIconPointerDown(e, icon)}
          >
            <HexIcon
              label={icon.label}
              onDoubleClick={() => openApp(icon.id, icon.label)}
              onClick={() => {}}
            />
          </div>
        ))}
      </div>

      {windows
        .slice()
        .sort((a, b) => a.z - b.z)
        .map(win => (
          <HexWindow
            key={win.id}
            title={win.title}
            onClose={() => closeWindow(win.id)}
            onFocus={() => bringToFront(win.id)}
            // position override if you want to allow window initial pos
            // ...existing code...
          >
            {win.appId === 'tictactoe' && <TicTacToe />}
            {win.appId === 'games' && (
              <div className="group-window">
                <HexIcon label="Snake" onDoubleClick={() => openApp('snake', 'Snake')} />
                <HexIcon label="TicTacToe" onDoubleClick={() => openApp('tictactoe', 'Tic Tac Toe')} />
              </div>
            )}
            {win.appId === 'chat' && (
              <div className="chat-placeholder">
                <p>AI Chatbot placeholder.</p>
                <p>To wire the chatbot, use an env var VITE_AI_KEY and fetch from your server or proxy.</p>
              </div>
            )}
            {win.appId === 'drawing' && <div style={{ padding: 20 }}>Simple drawing placeholder.</div>}
            {win.appId === 'notebook' && <div style={{ padding: 20 }}>Notebook placeholder.</div>}
            {win.appId === 'snake' && <div style={{ padding: 20 }}>Snake placeholder.</div>}
          </HexWindow>
        ))}
    </div>
  )
}