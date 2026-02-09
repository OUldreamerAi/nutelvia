import React from 'react'

export default function HexIcon({ label, onDoubleClick, onClick }) {
  return (
    <div className="hex-wrapper">
      <button className="hex" onClick={onClick} onDoubleClick={onDoubleClick} title={label}>
        <div className="hex-inner">{label[0]}</div>
      </button>
      <div className="hex-label">{label}</div>
    </div>
  )
}