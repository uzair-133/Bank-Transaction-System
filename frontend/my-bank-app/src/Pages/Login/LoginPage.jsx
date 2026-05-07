import React from 'react'
import Footer from '../../Components/Footer/Footer'
import style from './Login.module.css'
import { Link } from 'react-router-dom'
const LoginPage = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.box}>
          <h1>Login</h1>
          <form >
            <label >Enter Your Email</label>
            <input type="email" name="email" value="" placeholder="Enter Your Email" /><br />
            <label >Enter Your Password</label>
            <input type="password" name="password" value="" placeholder="Password" />
            <button>Login</button>
          </form>
          <div className={style.accountText}>
            <p className={style.dont}>Don't have Account? </p>
            <Link to='/register'>So Register</Link>
          </div>
        </div>
      </div>
      <Footer/>
      
      
      </>
  )
}

export default LoginPage