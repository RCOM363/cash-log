import React from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'
import "./Layout.css";

function Layout() {
  return (
    <div className='layout'>
      <div className='sidebarcont'>
        <Sidebar/>
      </div>
      <div className='maincont'>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
