import { useState } from 'react'
import HexIcon from './HexIcon.jsx'
import HexWindow from './HexWindow.jsx'
import TicTacToe from './TicTacToe.jsx'

export default function Desktop() {
  const [windows, setWindows] = useState([])

  function openApp(appId, title, props = {}) {
    setWindows(w => [...w, { id: Date.now() + Math.random(), appId, title, props }])
  }

  function closeWindow(id) {
    setWindows(w => w.filter(x => x.id !== id))
  }

  return (
    <div className="desktop">
      <div className="icon-grid">
        <HexIcon label="TicTacToe" onDoubleClick={() => openApp('tictactoe', 'Tic Tac Toe')} />
        <HexIcon label="Drawing" onDoubleClick={() => openApp('drawing', 'Drawing App')} />
        <HexIcon label="Notebook" onDoubleClick={() => openApp('notebook', 'Notebook')} />
        <HexIcon label="Games" onDoubleClick={() => openApp('games', 'Games')} />
        <HexIcon label="Chatbot" onDoubleClick={() => openApp('chat', 'AI Chatbot')} />
      </div>

      {windows.map(win => (
        <HexWindow key={win.id} title={win.title} onClose={() => closeWindow(win.id)}>
          {win.appId === 'tictactoe' && <TicTacToe />}
          {win.appId === 'games' && (
            <div className="group-window">
              <HexIcon label="Snake" onDoubleClick={() => openApp('snake', 'Snake')} />
              <HexIcon label="TicTacToe" onDoubleClick={() => openApp('tictactoe', 'Tic Tac Toe')} />
              {/* add more game icons here */}
            </div>
          )}
          {win.appId === 'chat' && (
            <div className="chat-placeholder">
              <p>AI Chatbot placeholder.</p>
              <p>To wire the chatbot, use an env var VITE_AI_KEY and fetch from your server or proxy.</p>
              {/* Example client fetch (do NOT put secrets here):
                fetch('/.netlify/functions/proxy', { method: 'POST', body: JSON.stringify({message}) })
                // or use import.meta.env.VITE_AI_KEY on the server side only.
              */}
            </div>
          )}
          {win.appId === 'drawing' && <div style={{padding:20}}>Simple drawing placeholder.</div>}
          {win.appId === 'notebook' && <div style={{padding:20}}>Notebook placeholder.</div>}
          {win.appId === 'snake' && <div style={{padding:20}}>Snake placeholder.</div>}
        </HexWindow>
      ))}
    </div>
  )
}