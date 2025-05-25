// ReportModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { reportButtonStyle, buttonStyle } from './styles/inlineStyles';

export default function ReportModal({
    isOpen,
    onClose,
    onSubmit,
    reportReason,
    setReportReason,
    reportStatusMsg
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
                <h2 className="text-xl font-semibold mb-4">Report This Job</h2>

                <label>Reason for reporting:</label>
                <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Please describe the issue..."
                    className="w-full mb-3 border rounded px-2 py-1"
                    rows={4}
                />

                {reportStatusMsg && (
                    <p className="text-sm text-red-600 mb-2">{reportStatusMsg}</p>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        style={reportButtonStyle}
                        onClick={onClose}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        style={reportButtonStyle}
                        onClick={onSubmit}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
