"use client"

import { useState } from "react"
import Accordion from "./accordion"

export default function TeamData() {
  const [teams] = useState([
    {
      id: 1,
      name: "Engineering Team",
      lead: {
        name: "John Doe",
        employeeId: "EMP001",
        email: "john.doe@company.com",
        role: "Team Lead",
      },
      members: [
        {
          name: "Alice Johnson",
          employeeId: "EMP002",
          email: "alice.johnson@company.com",
          role: "Senior Developer",
        },
        {
          name: "Bob Smith",
          employeeId: "EMP003",
          email: "bob.smith@company.com",
          role: "Developer",
        },
        {
          name: "Carol White",
          employeeId: "EMP004",
          email: "carol.white@company.com",
          role: "Junior Developer",
        },
      ],
    },
    {
      id: 2,
      name: "Marketing Team",
      lead: {
        name: "Sarah Williams",
        employeeId: "EMP005",
        email: "sarah.williams@company.com",
        role: "Team Lead",
      },
      members: [
        {
          name: "David Brown",
          employeeId: "EMP006",
          email: "david.brown@company.com",
          role: "Marketing Manager",
        },
        {
          name: "Emma Davis",
          employeeId: "EMP007",
          email: "emma.davis@company.com",
          role: "Content Specialist",
        },
      ],
    },
    {
      id: 3,
      name: "Sales Team",
      lead: {
        name: "Michael Johnson",
        employeeId: "EMP008",
        email: "michael.johnson@company.com",
        role: "Team Lead",
      },
      members: [
        {
          name: "Olivia Martinez",
          employeeId: "EMP009",
          email: "olivia.martinez@company.com",
          role: "Sales Executive",
        },
        {
          name: "James Wilson",
          employeeId: "EMP010",
          email: "james.wilson@company.com",
          role: "Sales Representative",
        },
        {
          name: "Sophie Taylor",
          employeeId: "EMP011",
          email: "sophie.taylor@company.com",
          role: "Sales Representative",
        },
      ],
    },
  ])

  return (
    <div className="content-section">
      <h2>Team Information</h2>
      <div className="team-list">
        {teams.map((team) => (
          <Accordion key={team.id} title={team.name} teamLead={team.lead} members={team.members} />
        ))}
      </div>
    </div>
  )
}
