// InterviewModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './ui/Button';
import { buttonStyle } from '../styles/inlineStyles';


export default function InterviewModal({
  isOpen, onClose, onConfirm,
  interviewType, setInterviewType,
  interviewDate, setInterviewDate,
  notes, setNotes
}) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "500px"
      }}>
        <h2 className="text-xl font-semibold mb-4">Schedule Interview</h2>

        <label>Interview Type:</label>
        <select
          value={interviewType}
          onChange={(e) => setInterviewType(e.target.value)}
          className="w-full mb-3 border rounded px-2 py-1"
        >
          <option value="" disabled>Select...</option>
          <option value="ONLINE">ONLINE</option>
          <option value="PHONE">PHONE</option>
          <option value="IN_PERSON">IN PERSON</option>
          <option value="GROUP">GROUP</option>
          <option value="TECHNICAL">TECHNICAL</option>
          <option value="HR">HR</option>
        </select>

        <label>Interview Date:</label>
        <input
          type="datetime-local"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          className="w-full mb-3 border rounded px-2 py-1"
        />

        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mb-4 border rounded px-2 py-1"
          rows={3}
        />

        <div className="flex justify-end gap-3">
          <button style={buttonStyle} onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          <button style={buttonStyle} onClick={onConfirm} className="bg-blue-600 text-white px-4 py-2 rounded">Confirm</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
