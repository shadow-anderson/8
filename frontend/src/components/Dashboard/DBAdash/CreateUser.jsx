import { useState } from "react"

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emp_id: "",
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
    setFormData({ name: "", email: "", phone: "", emp_id: "" })
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
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="emp_id">Employee Id:</label>
          <input id="emp_id" name="emp_id" value={formData.emp_id} onChange={handleChange} />
        </div>
        <div className="form-group">
          {/* <input type="checkbox" id="role" name="role" value="Role"></input>
          <label htmlFor="role">Role:</label> */}
        </div>
        
        <button type="submit" className="btn-submit">
          Create Admin
        </button>
      </form>
    </div>
  )
}
