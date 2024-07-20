import {useState} from 'react'
import { NavLink } from 'react-router-dom';
import "./Sidebar.css"
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { LuWallet } from "react-icons/lu";
import { TbLogout } from "react-icons/tb";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

function Sidebar() {

  const [showMenu,setShowMenu] = useState(false);

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
                <MdOutlineSpaceDashboard />
                <p>Dashboard</p>
            </NavLink>
            <NavLink className='links' to="expenses" >
              <RiMoneyRupeeCircleLine/>
              <p>Expenses</p>
            </NavLink>
            <NavLink className='links' to="incomes">
              <LuWallet/>
              <p>Incomes</p>
            </NavLink> 
            <button onClick={handleLogout}><TbLogout/>logout</button>
        </div>
        <div className="mobileview">
          <div className='cont2'>
            <h3>&#8377;Expense Tracker</h3>
            <div className="menubtn" onClick={() => setShowMenu(prev => !prev)}>
              {
                showMenu?<IoIosArrowUp/>:<IoIosArrowDown/>
              }
            </div>
          </div>
          <div className="cont3" style={{display:showMenu?'flex':'none'}}>
            <NavLink className='mobilelinks' to="" onClick={() => setShowMenu(prev => !prev)} end>
              <MdOutlineSpaceDashboard/>
              <p>Dashboard</p>
            </NavLink>
            <NavLink className='mobilelinks' to="expenses" onClick={() => setShowMenu(prev => !prev)} >
              <RiMoneyRupeeCircleLine/>
              <p>Expenses</p>
            </NavLink>
            <NavLink className='mobilelinks' to="incomes" onClick={() => setShowMenu(prev => !prev)}>
              <LuWallet/>
              <p>Incomes</p>
            </NavLink> 
            <button onClick={handleLogout}><TbLogout/>logout</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
