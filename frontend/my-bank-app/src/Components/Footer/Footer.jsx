import React from 'react'
import style from './Footer.module.css';

const Footer = () => {
  return (
  <>
  <div className={style.container}>
    <div className={style.Fcontent}>
        <div className={style.foot1}>
            <h3>UKBank</h3>
        </div>
        <div className={style.foot2}>
        <p>&copy; 2026 UKBank. Built for the modern era.</p>
        </div>
        <div className={style.foot3}>
          <p>Developed By Uzair Ahmad</p>
        </div>
    </div>
  </div>
  
  
  </>
  )
}

export default Footer