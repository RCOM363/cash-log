import React from 'react'
import { NavLink } from 'react-router-dom';
import "./Sidebar.css"
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { LuWallet } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post("/api/v1/users/logout")
    .then(()=> navigate("/signin"));
  }

  return (
    <>
      <div className='sidebar'>
        <div className='cont1'>
            <h3>&#8377;Expense Tracker</h3>
            <NavLink className='links' to="" end>
                <MdOutlineSpaceDashboard size={20}/>
                <p>Dashboard</p>
            </NavLink>
            <NavLink className='links' to="expenses" >
              <RiMoneyRupeeCircleLine size={20}/>
              <p>Expenses</p>
            </NavLink>
            <NavLink className='links' to="incomes">
              <LuWallet size={20}/>
              <p>Incomes</p>
            </NavLink> 
            <button onClick={handleLogout}><TbLogout/>logout</button>
        </div>
      </div>
    </>
  )
}

export default Sidebar
