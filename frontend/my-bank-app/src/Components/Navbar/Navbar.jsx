import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import style from './Navbar.module.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();


  const token = localStorage.getItem("token");

  const userName = localStorage.getItem("userName") || "User";

  const toggleMenu = () => setMenuOpen(open => !open)
  const closeMenu = () => setMenuOpen(false)
  const handleLogout = async () => {
    try {
      // Backend Logout API 
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (err) {
      console.log("Logout error:", err);
    } finally {
      // Local storage saaf karo aur redirect
      localStorage.clear();
      closeMenu();
      navigate("/login");
    }
  }


  return (

    <header className={style.header}>
      <nav className={style.navbar}>
        <div className={style.logo}>
          <h2>UkBank</h2>
        </div>

        <button onClick={toggleMenu} className={style.menuButton}>
          <span className={style.menuIcon} />
        </button>

        <div className={`${style.navContent} ${menuOpen ? style.open : ''}`}>
          <ul className={style.navLinks}>
            <li><Link to="/" onClick={closeMenu}>Home</Link></li>
            {/* Agar login ho toh Dashboard ka link dikhao */}
            {token && <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>}
          </ul>

          <div className={style.btnGroup}>
            {token ? (
              <>
                <span className={style.userName}>Hi, {userName}</span>
                <button onClick={handleLogout} className={style.logoutButton}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={style.navButton} onClick={closeMenu}>Login</Link>
                <Link to="/register" className={style.navButton} onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar