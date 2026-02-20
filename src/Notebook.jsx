import { useState } from 'react';

export default function Notebook() {
  const [notes, setNotes] = useState(['']);



  function updateNote(idx, value) {
    setNotes(notes.map((n, i) => (i === idx ? value : n)));
  }

  return (
    <div style={{ padding: 12 }}>
      <h3>Notebook</h3>
      {notes.map((note, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <textarea
            value={note}
            onChange={e => updateNote(idx, e.target.value)}
            rows={4}
            style={{ width: '80%', borderRadius: 6, padding: 8 }}
            placeholder={`Note ${idx + 1}`}
          />
        </div>
      ))}
    </div>
  );
}
