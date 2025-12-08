"use client"

import { useState } from "react"

export default function EvidenceSubmission() {
  const [evidence, setEvidence] = useState([])

  const handleEvidenceUpload = (e, type) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      setEvidence([
        ...evidence,
        {
          id: Date.now() + Math.random(),
          name: file.name,
          type: type,
          size: (file.size / 1024).toFixed(2),
          uploadedAt: new Date().toLocaleString(),
        },
      ])
    })
  }

  const evidenceTypes = [
    {
      title: "Upload Document (PDF/DOCX)",
      type: "document",
      icon: "📄",
      accept: ".pdf,.docx,.doc",
    },
    {
      title: "Upload Receipt Tracking Sheet",
      type: "receipt",
      icon: "📊",
      accept: ".xlsx,.xls,.csv",
    },
    {
      title: "Upload Communication Records",
      type: "communication",
      icon: "💬",
      accept: ".pdf,.docx,.jpg,.png",
    },
    {
      title: "Upload e-Office Screenshots",
      type: "screenshot",
      icon: "📸",
      accept: ".jpg,.jpeg,.png,.gif",
    },
  ]

  return (
    <div className="hq-evidence-section">
      <h2 className="hq-section-title">Evidence Submission Tools</h2>

      <div className="hq-evidence-grid">
        {evidenceTypes.map((evType) => (
          <div key={evType.type} className="hq-evidence-card">
            <span className="hq-evidence-icon">{evType.icon}</span>
            <h3>{evType.title}</h3>
            <label className="hq-upload-label-primary">
              <input
                type="file"
                multiple
                accept={evType.accept}
                onChange={(e) => handleEvidenceUpload(e, evType.type)}
                className="hq-file-input"
              />
              Click to upload
            </label>
          </div>
        ))}
      </div>

      {evidence.length > 0 && (
        <div className="hq-evidence-list">
          <h3 className="hq-file-list-title">Submitted Evidence</h3>
          <div className="hq-evidence-items">
            {evidence.map((item) => (
              <div key={item.id} className="hq-evidence-item">
                <div className="hq-evidence-item-header">
                  <span className="hq-evidence-type-badge">{item.type}</span>
                  <button
                    className="hq-file-remove"
                    onClick={() => setEvidence(evidence.filter((e) => e.id !== item.id))}
                  >
                    ✕
                  </button>
                </div>
                <p className="hq-evidence-filename">{item.name}</p>
                <p className="hq-evidence-meta">
                  {item.size} KB • {item.uploadedAt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
