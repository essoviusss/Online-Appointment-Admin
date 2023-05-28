import React, { useState } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router";
import Button from '@mui/material/Button';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'; 

import './Sidebar.css'; // Import the CSS file

const Sidebar = () => {
  const [statusOpen, setStatusOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out!");
    navigate("/", { replace: true });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="black">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            DepEd
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/AdminDashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/Appointments" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Appointments</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/AdminCalendar" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Calendar</CDBSidebarMenuItem>
            </NavLink>

            <CDBSidebarMenuItem icon="table" className="relative-container" onClick={() => setStatusOpen(!statusOpen)}>
              Status {statusOpen ? <FaCaretUp /> : <FaCaretDown />}
              {statusOpen && (
                <div className="status-dropdown">
                  <NavLink exact to="/Approved" activeClassName="activeClicked">
                    <CDBSidebarMenuItem>Approved</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/Resched" activeClassName="activeClicked">
                    <CDBSidebarMenuItem>Rescheduled</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/Cancelled" activeClassName="activeClicked">
                    <CDBSidebarMenuItem>Cancelled</CDBSidebarMenuItem>
                  </NavLink>
                </div>
              )}
            </CDBSidebarMenuItem>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div style={{ padding: '20px 5px' }}>
            <Button onClick={logout}>Logout</Button>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
