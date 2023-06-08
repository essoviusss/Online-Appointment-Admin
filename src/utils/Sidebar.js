import React, { useState } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useLocation } from 'react-router-dom';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'; 
import './Sidebar.css';

const Sidebar = () => {
  // eslint-disable-next-line
  const [statusOpen, setStatusOpen] = useState(false);
  // eslint-disable-next-line
  const [showLogo, setShowLogo] = useState(true);
  const [isToggled, setIsToggled] = useState(false);
  const location = useLocation();

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        transition: 'margin-right 0.5s ease',
        marginRight: isToggled ? '80px' : '270px',
        backgroundColor: '#F4F7FE',
        overflow: 'hidden'
      }}
    >
      <CDBSidebar
        textColor="#025BAD"
        backgroundColor="white"
        style={{
          boxShadow: '2px 0px 5px 0px rgba(50, 50, 50, 0.2)',
          position: 'fixed'
        }}
      >
        <CDBSidebarHeader
          prefix={
            <i
              className="fa fa-bars fa-large custom-icon"
              onClick={handleToggle}
              style={{ height: '50px' }}
            />
          }
        >
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
              <CDBSidebarMenuItem  icon="home" style={location.pathname === '/AdminDashboard' ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={location.pathname === '/AdminDashboard' ? 'text-primary' : 'text-gray'}  iconClassName={`fa-columns ${location.pathname === '/AdminDashboard' ? 'active-icon' : ''}`}>Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/Appointments" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="list" style={location.pathname === '/Appointments' ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={location.pathname === '/Appointments' ? 'text-primary' : 'text-gray'}  iconClassName={`fa-columns ${location.pathname === '/Appointments' ? 'active-icon' : ''}`}>Appointments</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/AdminCalendar" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="calendar" style={location.pathname === '/AdminCalendar' ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={location.pathname === '/AdminCalendar' ? 'text-primary' : 'text-gray'}  iconClassName={`fa-columns ${location.pathname === '/AdminCalendar' ? 'active-icon' : ''}`}>Calendar</CDBSidebarMenuItem>
            </NavLink>
            <CDBSidebarMenuItem icon="table" style={statusOpen ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={statusOpen ? 'text-primary' : 'text-gray'}  iconClassName={`fa-columns ${statusOpen ? 'active-icon' : ''}`} activeClassName="activeClicked" onClick={() => setStatusOpen(!statusOpen)}>
              Status {statusOpen ? <FaCaretUp /> : <FaCaretDown />}
              {statusOpen && (
                <div className="status-dropdown">
                  <NavLink exact to="/Approved" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="check" style={location.pathname === '/Approved' ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={location.pathname === '/Approved' ? 'text-primary' : 'text-gray'}  iconClassName={`fa-columns ${location.pathname === '/Approved' ? 'active-icon' : ''}`}>Approved</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/Resched" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="calendar" style={location.pathname === '/Resched' ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={location.pathname === '/Resched' ? 'text-primary' : 'text-gray'}  iconClassName={`fa-columns ${location.pathname === '/Resched' ? 'active-icon' : ''}`}>Rescheduled</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/Cancelled" activeClassName="activeClicked">
                    <CDBSidebarMenuItem icon="minus" style={location.pathname === '/Cancelled' ? { backgroundColor: '#EBF1FF', borderRadius: '15px', padding: '5px' } : { borderRadius: '10px', padding: '5px' }} className={location.pathname === '/Cancelled' ? 'text-primary' : 'text-gray'}  iconClassName={`fa-columns ${location.pathname === '/Cancelled' ? 'active-icon' : ''}`}>Cancelled</CDBSidebarMenuItem>
                  </NavLink>
                </div>
              )}
          </CDBSidebarMenuItem>
          </CDBSidebarMenu>

          

        </CDBSidebarContent>
      </CDBSidebar>

      <style>
        {`
          .sidebar-content .fa-columns,
          .sidebar-content .fa-table,
          .sidebar-content .fa-user {
            color: gray;
          }

          .sidebar-content .activeClicked {
            color: #025BAD !important;
            background-color: red !important;
            border-radius: 10px !important;
          }

          .sidebar-content .activeClicked:hover {
            color: #025BAD !important;
            background-color: blue !important;
            border-radius: 10px !important;
          }

          .sidebar-content .active-icon {
            color: #025BAD !important;
          }

          .text-primary {
            color: #025BAD !important;
            font-weight: bold;
          }

          .text-gray {
            color: gray !important;
          }

          .custom-icon {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .sidebar-content .sidebar-menu a:hover {
            color: #025BAD !important;
            background-color: blue !important;
            border-radius: 10px !important;
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;
