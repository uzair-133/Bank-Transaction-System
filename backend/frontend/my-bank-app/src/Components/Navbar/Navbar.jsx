import { Link } from "react-router-dom";
import style from './Navbar.module.css'

const Navbar = () => {
  return (
   <>
   <header>
    <nav>
        <div className={style.logo}>
            <h2>UkBank</h2>
        </div>
        <div>
            <ul>
                <li>Home</li>
            </ul>
            <div>
                <button>Login</button>
                <button>Register</button>
            </div>
        </div>
    </nav>
   </header>
   
   
   </>
  )
}

export default Navbar