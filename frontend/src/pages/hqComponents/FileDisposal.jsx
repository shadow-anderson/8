"use client"

import { useState } from "react"

export default function FileDisposal() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [notes, setNotes] = useState("")
  const [linkedCommunication, setLinkedCommunication] = useState("")

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      setUploadedFiles([
        ...uploadedFiles,
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

  const turnaroundTime = Math.floor(Math.random() * 48) + 1
  const cycles = Math.floor(Math.random() * 3) + 1

  return (
    <div className="hq-disposal-section">
      <h2 className="hq-section-title">File Disposal Panel</h2>

      <div className="hq-disposal-container">
        <div className="hq-upload-area">
          <div className="hq-upload-box">
            <label className="hq-upload-label">
              <input type="file" multiple onChange={(e) => handleFileUpload(e, "draft")} className="hq-file-input" />
              <span>📄 Upload Draft/File</span>
            </label>
          </div>

          <div className="hq-upload-box">
            <label className="hq-upload-label">
              <input type="file" multiple onChange={(e) => handleFileUpload(e, "evidence")} className="hq-file-input" />
              <span>📎 Upload Supporting Evidence</span>
            </label>
          </div>

          <div className="hq-textarea-wrapper">
            <label className="hq-label">Add Notes/Remarks</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="hq-textarea"
              placeholder="Add any notes or remarks..."
              rows="3"
            />
          </div>

          <div className="hq-textarea-wrapper">
            <label className="hq-label">Add Linked Communication</label>
            <input
              type="text"
              value={linkedCommunication}
              onChange={(e) => setLinkedCommunication(e.target.value)}
              className="hq-input"
              placeholder="Letter No., Outward Ref., etc."
            />
          </div>
          <button>Submit</button>
        </div>

        <div className="hq-disposal-stats">
          <div className="hq-stat-box">
            <h4>Turnaround Time</h4>
            <p className="hq-stat-value">{turnaroundTime} hours</p>
          </div>
          <div className="hq-stat-box">
            <h4>Revision Cycles</h4>
            <p className="hq-stat-value">{cycles}</p>
          </div>
          <div className="hq-stat-box">
            <h4>Quality Score</h4>
            <p className="hq-stat-value">92%</p>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="hq-file-list">
            <h3 className="hq-file-list-title">Uploaded Files</h3>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="hq-file-item">
                <span className="hq-file-icon">📄</span>
                <div className="hq-file-details">
                  <p className="hq-file-name">{file.name}</p>
                  <p className="hq-file-meta">
                    {file.size} KB • {file.type} • {file.uploadedAt}
                  </p>
                </div>
                <button
                  className="hq-file-remove"
                  onClick={() => setUploadedFiles(uploadedFiles.filter((f) => f.id !== file.id))}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
