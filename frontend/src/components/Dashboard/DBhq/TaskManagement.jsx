"use client"

import { useState } from "react"

export default function TaskManagement() {
  const [filterStatus, setFilterStatus] = useState("all")

  const tasks = [
    {
      id: 1,
      title: "Annual Performance Review Form",
      priority: "High",
      deadline: "2025-01-15",
      assignedBy: "HR Manager",
      completion: 65,
      status: "In-Progress",
      slaHours: 12,
    },
    {
      id: 2,
      title: "Submit Monthly Report",
      priority: "Medium",
      deadline: "2025-01-10",
      assignedBy: "Department Head",
      completion: 100,
      status: "Completed",
      slaHours: 0,
    },
    {
      id: 3,
      title: "Policy Review Comments",
      priority: "High",
      deadline: "2025-01-08",
      assignedBy: "Admin Officer",
      completion: 45,
      status: "Pending",
      slaHours: 48,
    },
    {
      id: 4,
      title: "File Disposal Documentation",
      priority: "Critical",
      deadline: "2025-01-05",
      assignedBy: "Records Officer",
      completion: 20,
      status: "Overdue",
      slaHours: -24,
    },
    {
      id: 5,
      title: "Prepare Training Materials",
      priority: "Low",
      deadline: "2025-01-20",
      assignedBy: "L&D Head",
      completion: 30,
      status: "Pending",
      slaHours: 72,
    },
  ]

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      "In-Progress": "hq-badge-progress",
      Completed: "hq-badge-completed",
      Pending: "hq-badge-pending",
      "Sent for Review": "hq-badge-review",
      Overdue: "hq-badge-overdue",
    }
    return statusMap[status] || "hq-badge-pending"
  }

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "all") return true
    return task.status.toLowerCase() === filterStatus.toLowerCase()
  })

  return (
    <div className="hq-task-section">
      <h2 className="hq-section-title">Assigned Task Management</h2>

      <div className="hq-filter-buttons">
        <button
          className={`hq-filter-btn ${filterStatus === "all" ? "hq-filter-active" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          All Tasks
        </button>
        <button
          className={`hq-filter-btn ${filterStatus === "pending" ? "hq-filter-active" : ""}`}
          onClick={() => setFilterStatus("pending")}
        >
          Pending
        </button>
        <button
          className={`hq-filter-btn ${filterStatus === "in-progress" ? "hq-filter-active" : ""}`}
          onClick={() => setFilterStatus("in-progress")}
        >
          In-Progress
        </button>
        <button
          className={`hq-filter-btn ${filterStatus === "completed" ? "hq-filter-active" : ""}`}
          onClick={() => setFilterStatus("completed")}
        >
          Completed
        </button>
      </div>

      <div className="hq-table-wrapper">
        <table className="hq-task-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Assigned By</th>
              <th>Progress</th>
              <th>Status</th>
              <th>SLA Timer</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td className="hq-task-title">{task.title}</td>
                <td>
                  <span className={`hq-priority-badge hq-priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </td>
                <td>{task.deadline}</td>
                <td>{task.assignedBy}</td>
                <td>
                  <div className="hq-progress-bar">
                    <div className="hq-progress-fill" style={{ width: `${task.completion}%` }}></div>
                    <span className="hq-progress-text">{task.completion}%</span>
                  </div>
                </td>
                <td>
                  <span className={`hq-status-badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
                </td>
                <td className={task.slaHours < 0 ? "hq-sla-critical" : ""}>
                  {task.slaHours > 0 ? `${task.slaHours}h left` : "OVERDUE"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
