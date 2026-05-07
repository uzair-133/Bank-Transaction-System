import style from './Hero.module.css'
import { Link } from 'react-router-dom'
const Hero = () => {
    return (
        <>
            <div className={style.container}>
                <div className={style.Hcontent}>
                    <h1>Banking Built for the<span>Digital Era</span></h1>
                    <p>Manage your money with confidence. Send transfers instantly, track every transaction, and keep full control — all from one elegant dashboard.</p>
                    <div className={style.btn}>
                        <Link to="/register" className={style.btn1}>Open Free Account</Link>
                        <Link to="/login" className={style.btn2}>Sign In to Dashboard</Link>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Hero