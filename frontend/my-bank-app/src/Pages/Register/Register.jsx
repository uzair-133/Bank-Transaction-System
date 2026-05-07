import { useState } from "react"
import style from './Register.module.css'
import Footer from "../../Components/Footer/Footer"
const Register = () => {
  return (
      <>
      <div className={style.container}>
        <div className={style.box}>
          <h1>Register</h1>
          <p>Create New Account</p>
          <form >
            <label>Enter Your Name</label>
            <input type="text" name="name" value="" placeholder="Enter Your Name"  /><br />
            <label >Enter Your Email</label>
            <input type="email" name="email" value="" placeholder="Enter Your Email" /><br />
            <label >Enter Your Password</label>
            <input type="password" name="password" value="" placeholder="Password" />

            <button>Register</button>
          </form>
        </div>
      </div>
      <Footer/>
      
      
      </>
  )
}

export default Register