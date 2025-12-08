import { useState } from "react"

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emp_id: "",
    emp_role: "",
    emp_division: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("New Admin:", formData)
    alert("User created successfully!")
    setFormData({ name: "", email: "", phone: "", emp_id: "", emp_role: "", emp_division: "" })
  }

  return (
    <div className="content-section">
      <h2>Create New Admin</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="emp_id">Employee Id:</label>
          <input id="emp_id" name="emp_id" value={formData.emp_id} onChange={handleChange} required />
        </div>
        <div className="form-dropdown-group">
          <div className="form-group-dropdown">
            <label htmlFor="emp_role">Role:</label>
            <select name="emp_role" id="emp_role" value={formData.emp_role} onChange={handleChange}>
              <option value="" selected required>Select</option>
              <option value="individual">Individual</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="form-group-dropdown">
            <label htmlFor="emp_division">Division:</label>
            <select name="emp_division" id="emp_division" value={formData.emp_division} onChange={handleChange}>
              <option value="" selected required>Select</option>
              <option value="hq" selected>HQ</option>
              <option value="field" selected>Field</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="btn-submit">
          Create Admin
        </button>
      </form>
    </div>
  )
}
