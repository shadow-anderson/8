
import { useState } from "react"

export default function IndividualData() {
  const [employees] = useState([
    {
      id: "EMP001",
      name: "John Doe",
      email: "john.doe@company.com",
      phone: "555-0101",
      address: "New York, NY",
      role: "Team Lead",
      department: "Engineering",
    },
    {
      id: "EMP002",
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      phone: "555-0102",
      address: "San Francisco, CA",
      role: "Senior Developer",
      department: "Engineering",
    },
    {
      id: "EMP003",
      name: "Bob Smith",
      email: "bob.smith@company.com",
      phone: "555-0103",
      address: "Boston, MA",
      role: "Developer",
      department: "Engineering",
    },
    {
      id: "EMP005",
      name: "Sarah Williams",
      email: "sarah.williams@company.com",
      phone: "555-0105",
      address: "Los Angeles, CA",
      role: "Team Lead",
      department: "Marketing",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="content-section">
      <h2>Individual Employee Data</h2>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name or employee ID..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="employee-list">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <div className="employee-header">
              <h3> <input value= {employee.name} /></h3>
              <span className="employee-id"> {employee.id}
              </span>
            </div>
            <div className="employee-details">
              <p>
                <strong>Email:</strong> 
                <input value= {employee.email} />
              </p>
              <p>
                <strong>Phone:</strong> 
                <input value= {employee.phone} />
              </p>
              {/* <p>
                <strong>Address:</strong> {employee.address}
              </p> */}
              <p>
                <strong>Role:</strong> 
                <input value= {employee.role}/>
              </p>
              {/* <p>
                <strong>Department:</strong> 
                <input value= {employee.department}/>
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
