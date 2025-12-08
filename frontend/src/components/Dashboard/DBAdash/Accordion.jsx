import { useState } from "react"
import '../style-dashboard/dash.css';

export default function Accordion({ title, teamLead, members }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="accordion-title">{title}</span>
        <span className={`accordion-toggle ${isOpen ? "open" : ""}`}>▼</span>
      </button>
      {isOpen && (
        <div className="accordion-content">
          <div className="team-lead-section">
            <h4>Team Lead</h4>
            <div className="member-card lead">
              <div className="lead-info">
                <p className="member-name">
                   <input value={teamLead.name} />
                </p>
                <p className="member-detail">
                  <strong>Employee ID:</strong> 
                  <input value={teamLead.employeeId} />
                </p>
                <p className="member-detail">
                  <strong>Email:</strong> 
                   <input value={teamLead.email} />
                </p>
                <p className="member-detail">
                  <strong>Role:</strong>
                   <input value={teamLead.role} />
                </p>
              </div>
            </div>
          </div>

          <div className="team-members-section">
            <h4>Team Members</h4>
            {members.map((member, index) => (
              <div key={index} className="member-card">
                <div className="member-info">
                  <p className="member-name">
                    <input value= {member.name} />
                  </p>
                  <p className="member-detail">
                    <strong>Employee ID:</strong> 
                    <input value={member.employeeId} />
                  </p>
                  <p className="member-detail">
                    <strong>Email:</strong> 
                    <input value={member.email} />
                  </p>
                  <p className="member-detail">
                    <strong>Role:</strong> 
                    <input value={member.role} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className=""></div>
        </div>
      )}
    </div>
  )
}
