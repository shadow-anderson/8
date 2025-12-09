"use client"

import { useState } from "react"
import "../style-dashboard/dash.css";
import CreateUser from "./CreateUser";
import TeamData from "./TeamData"
import IndividualData from "./IndividualData"
import Sidebar from "./Sidebar";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderContent = () => {
    switch (activeSection) {
      case "create-admin":
        return <CreateUser />
      case "team-data":
        return <TeamData />
      case "individual-data":
        return <IndividualData />
      default:
        return (
          <div className="dashboard-welcome">
            <h1>Welcome to DBA Dashboard</h1>
            <p>Select an option from the left sidebar to get started.</p>
          </div>
        )
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  )
}