import React, { useState } from 'react';
import style from './Transaction.module.css';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid lazmi kar lena

const Transaction = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    toAccount: '',
    amount: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const idempotencyKey = uuidv4();
    // LocalStorage se ID uthayein jo humne login par save ki thi
    const myAccountId = localStorage.getItem("accountId");

    if (!myAccountId) {
      alert("Sender account not found. Please re-login.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://bank-transaction-system-amber.vercel.app/api/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          fromAccount: myAccountId,          // MongoDB ID
          toAccount: formData.toAccount,     // Recipient ki MongoDB ID
          amount: Number(formData.amount),   // Number format
          idempotencyKey: idempotencyKey
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Paisa Transfer Ho Gaya!");
        navigate("/dashboard");
      } else {
        // Backend jo error msg bhej raha hai wo dikhayein
        alert(result.message || "Transaction fail ho gayi");
      }
    } catch (err) {
      alert("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <div className={style.box}>
        <h1>Send Money</h1>
        <form onSubmit={handleSubmit}>
          <label>Recipient Account Number</label>
          <input
            type="text"
            name="toAccount"
            value={formData.toAccount}
            onChange={handleChange}
            placeholder="Enter Account Number"
            required
          />

          <label>Amount (PKR)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          <label>Description (Optional)</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Purpose of payment"
          />

          <button type="submit" className={style.submitBtn} disabled={loading}>
            {loading ? "Processing..." : "Transfer Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transaction;