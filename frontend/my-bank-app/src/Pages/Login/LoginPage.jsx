
import { useState } from "react"
import style from './Login.module.css'
import Footer from "../../Components/Footer/Footer"
import { useNavigate, Link } from "react-router-dom"
const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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

    const { email, password } = formData;
    if (!formData.email || !formData.password) {
      setError("all fields is required");
      return;
    }
    else if (formData.password.length < 6) {
      setError("Lenght is too short");
      return
    }
    setError("")
    setLoading(true)


    try {
      const url = "http://localhost:3000/api/auth/login"
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        setError("");
        alert(result.message || "Login Successful!");
        setFormData({
          email: "",
          password: "",
        });
       // Simple alert
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        const errorMsg = result.error?.details?.[0]?.message || result.message || "Login fail ho gaya";
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
          <h1>Login</h1>
          <form onSubmit={HandleSubmit}>
            <label >Enter Your Email</label>
            <input type="email" name="email" value={formData.email} placeholder="Enter Your Email" onChange={HandleChange} /><br />
            <label >Enter Your Password</label>
            <input type="password" name="password" value={formData.password} placeholder="Password" onChange={HandleChange} />
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className={style.accountText}>
            <p className={style.dont}>Don't have Account? </p>
            <Link to='/register'>So Register</Link>
          </div>
        </div>
      </div>
      <Footer />


    </>
  )
}

export default LoginPage