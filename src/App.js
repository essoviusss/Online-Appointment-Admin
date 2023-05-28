import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

//Paths
import Login from './auth/Login';
import Sidebar from './utils/Sidebar';
import AdminDashboard from './pages/Admin_Dashboard';
import Appointments from './pages/Admin_Appointments';
import AdminCalendar from './pages/Admin_Calendar';
import Cancelled from './pages/Appointment_Components/Cancelled';
import Resched from './pages/Appointment_Components/Resched';
import Approved from './pages/Appointment_Components/Approved';


function MainContent() {
  const location = useLocation();

  if (location.pathname === '/') {
    return <Login />;
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div
          className="main-content"
          style={{
            flex: 1,
            overflow: 'auto',
            paddingBottom: 15,
            backgroundColor: '#F4F7FE',
            boxSizing: 'border-box',
            minHeight: '100%',
          }}
        >
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/Sidebar" element={<Sidebar />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route path="/Appointments" element={<Appointments />} />
            <Route path="/AdminCalendar" element={<AdminCalendar />} />
            <Route path="/Cancelled" element={<Cancelled />} />
            <Route path="/Resched" element={<Resched />} />
            <Route path="/Approved" element={<Approved />} />
        </Routes>
      </div>
    </div>
  );
}
function App() {
  return (
    <Router>
        <MainContent />
    </Router>
  );
}

export default App;