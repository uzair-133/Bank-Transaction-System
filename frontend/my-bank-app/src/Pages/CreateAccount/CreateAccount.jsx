import React from 'react'
import style from "./Account.module.css"
import { useNavigate } from 'react-router-dom'

const CreateAccount = () => {
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    try {
      const token = localStorage.getItem("token"); // Token uthaya

      const CreateAcc = await fetch("https://bank-transaction-system-amber.vercel.app/api/accounts/", {
        method: "POST", // Account banane ke liye POST
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });

      if (CreateAcc.ok) {
        alert("Account Created Successfully!");
        navigate("/dashboard");
      } else {
        alert("Account banane mein masla hua.");
      }
    } catch (err) {
      alert("Backend server connection error");
    }
  }

  return (
    <div className={style.container}>
        <h1>Welcome to Uk Bank</h1>
        <p>We are glad to have you here. Please create an account to get started.</p>
        
       
        <button 
          onClick={handleCreateAccount} 
          className={style.AccountBtn}
        >
          Create Account
        </button>
    </div>
  )
}

export default CreateAccount;