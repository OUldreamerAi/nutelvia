import { useState, useRef } from 'react'
import HexIcon from './HexIcon.jsx'
import HexWindow from './HexWindow.jsx'
import TicTacToe from './TicTacToe.jsx'
import Snake from './Snake.jsx'
import Notebook from './Notebook.jsx'
import Drawing from './Drawing.jsx'

export default function Desktop() {
  const hexWidth = 150 
  const hexHeight = 130 
  const horizontalOffset = hexWidth / 2 
  

  const [icons, setIcons] = useState([
    { id: 'tictactoe', label: 'TicTacToe', x: 50, y: 40 },
    { id: 'drawing', label: 'Drawing', x: 50 + hexWidth * 2, y: 40 },
    
    { id: 'notebook', label: 'Notebook', x: 50 + horizontalOffset, y: 40 + hexHeight },
    { id: 'games', label: 'Games', x: 50 + horizontalOffset + hexWidth * 2, y: 40 + hexHeight },
    
  ])

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

  const dragging = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })

  function onIconPointerDown(e, icon) {
    e.preventDefault()
    dragging.current = icon.id
    dragOffset.current = { x: e.clientX - icon.x, y: e.clientY - icon.y }
    window.addEventListener('pointermove', onIconPointerMove)
    window.addEventListener('pointerup', onIconPointerUp)
  }

  function onIconPointerMove(e) {
    const id = dragging.current
    if (!id) return
    
    const nx = Math.max(0, Math.min(window.innerWidth - 140, e.clientX - dragOffset.current.x))
    const ny = Math.max(0, Math.min(window.innerHeight - 160, e.clientY - dragOffset.current.y))
    
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

      {(() => {
        const topZ = windows.length ? Math.max(...windows.map(w => w.z)) : 0
        return windows
          .slice()
          .sort((a, b) => a.z - b.z)
          .map(win => (
            <HexWindow
              key={win.id}
              title={win.title}
              onClose={() => closeWindow(win.id)}
              onFocus={() => bringToFront(win.id)}
              z={win.z}
              isFocused={win.z === topZ}
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
              {win.appId === 'drawing' && <Drawing />}
              {win.appId === 'notebook' && <Notebook />}
              {win.appId === 'snake' && <Snake />}
            </HexWindow>
          ))
      })()}
    </div>
  )
}