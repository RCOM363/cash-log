import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <div className="logo">
        <h3>&#8377;Expense Tracker</h3>
      </div>
      <div className="links">
        <Link to="signup">signup</Link>
        <Link to="signin">signin</Link>
      </div>
    </nav>
  )
}

export default Navbar
