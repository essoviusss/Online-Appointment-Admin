import React, { useState } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'; 

import './Sidebar.css';

const Sidebar = () => {
  const [statusOpen, setStatusOpen] = useState(false);
  // eslint-disable-next-line
  const [showLogo, setShowLogo] = useState(true);
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="rgb(255, 255, 255)" backgroundColor="grey">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/images/logo.png"
              alt="logo"
              style={{ height: '40px', marginRight: '8px', marginTop: '3px' }}
            />
            <span style={{ color: 'inherit', fontSize: '120%', paddingTop: '5px' }}>
              {showLogo ? 'ADMIN' : ''}
            </span>
          </div>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/AdminDashboard" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="home">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/Appointments" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="list">Appointments</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/AdminCalendar" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="calendar">Calendar</CDBSidebarMenuItem>
            </NavLink>

            <CDBSidebarMenuItem icon="table" className="relative-container" onClick={() => setStatusOpen(!statusOpen)}>
              Status {statusOpen ? <FaCaretUp /> : <FaCaretDown />}
              {statusOpen && (
                <div className="status-dropdown">
                  <NavLink exact to="/Approved" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="check">Approved</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/Resched" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="calendar">Rescheduled</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/Cancelled" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="minus">Cancelled</CDBSidebarMenuItem>
                  </NavLink>
                </div>
              )}
            </CDBSidebarMenuItem>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
