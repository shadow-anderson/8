"use client"

import { useState } from "react"
import "../style-dashboard/HQ.css";
import HQSidebar from "./HQSidebar";
import ProductivityCards from "./ProductivityCard"
import TaskManagement from "./TaskManagement"
import FileDisposal from "./FileDisposal"
import EvidenceSubmission from "./EvidenceSubmission"
import TimelineMap from "./TimelineMap"
import NotificationCenter from "./NotificationCenter"
import KPIReport from "./KPIreport"
import GrowthRecognition from "./GrowthRecognition"

export default function HQDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="hq-overview">
            <ProductivityCards />
            <TaskManagement />
            <FileDisposal />
          </div>
        )
      case "tasks":
        return <TaskManagement />
      case "evidence":
        return <EvidenceSubmission />
      case "timeline":
        return <TimelineMap />
      case "notifications":
        return <NotificationCenter />
      case "kpi":
        return <KPIReport />
      case "growth":
        return <GrowthRecognition />
      default:
        return <ProductivityCards />
    }
  }

  return (
    <div className="hq-container">
      <HQSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="hq-main-content">{renderContent()}</main>
    </div>
  )
}
