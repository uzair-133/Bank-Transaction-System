import { useState } from 'react'
import { Link } from 'react-router-dom'
import style from './Navbar.module.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(open => !open)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={style.header}>
      <nav className={style.navbar}>
        <div className={style.logo}>
          <h2>UkBank</h2>
        </div>

        <button
          type="button"
          className={`${style.menuButton} ${menuOpen ? style.menuButtonActive : ''}`}
          onClick={toggleMenu}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <span className={style.menuIcon} />
        </button>

        <div className={`${style.navContent} ${menuOpen ? style.open : ''}`}>
          <ul className={style.navLinks}>
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
          </ul>

          <div className={style.btnGroup}>
            <Link to="/login" className={style.navButton} onClick={closeMenu}>Login</Link>
            <Link to="/register" className={style.navButton} onClick={closeMenu}>Register</Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar