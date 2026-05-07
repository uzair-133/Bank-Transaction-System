import { useState } from "react"
import style from './Register.module.css'
import Footer from "../../Components/Footer/Footer"
import { useNavigate } from "react-router-dom"
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const HandleChange = ((e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyForm = { ...formData }
    copyForm[name] = value;
    setFormData(copyForm)
  })
  console.log('signup info ->', formData);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; 

    const { name, email, password } = formData;
    if (!formData.name || !formData.email || !formData.password) {
      setError("all fields is required");
      
    }
    else if (formData.password.length < 6) {
      setError("Lenght is too short");
      return
    }
    setError("")
   setLoading(true)


    try {
      const url = "http://localhost:3000/api/auth/register"
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const result = await response.json();

      if (response.status === 201 || result.success === true) {
        setError("");
        alert(result.message || "Signup Successful!");

        setFormData({
          name: "",
          email: "",
          password: "",
        });
        // Simple alert
        setTimeout(() => {
          navigate("/login");
        }, 500);
      } else {
        const errorMsg = result.error?.details?.[0]?.message || result.message || "Signup fail ho gaya";
        alert(errorMsg);
      }
    } catch (err) {
      alert("Backend server se connection nahi ho raha.");
    }
     finally {
  setLoading(false);
}
  }
  return (
    <>
      <div className={style.container}>
        <div className={style.box}>
          <h1>Register</h1>
          <p>Create New Account</p>
          <form onSubmit={HandleSubmit}>
            <label>Enter Your Name</label>
            <input type="text" name="name" value={formData.name} placeholder="Enter Your Name" onChange={HandleChange} /><br />
            <label >Enter Your Email</label>
            <input type="email" name="email" value={formData.email} placeholder="Enter Your Email" onChange={HandleChange} /><br />
            <label >Enter Your Password</label>
            <input type="password" name="password" value={formData.password} placeholder="Password" onChange={HandleChange} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
      <Footer />


    </>
  )
}

export default Register