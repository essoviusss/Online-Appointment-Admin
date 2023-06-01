import { useEffect, useState } from "react";
import Header from "../utils/Header";
import './Dahboard_Components/Dashboard.css'
import axios from "axios";
import Calendar from "../utils/Calendar";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FcCancel } from "react-icons/fc";
import { FcOk } from "react-icons/fc";
import { FcViewDetails } from "react-icons/fc";
import { FcCalendar } from "react-icons/fc";
import { FcMinus } from "react-icons/fc";
import useAuth from "../hooks/useAuth";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const isLoggedIn = useAuth(); 
  const [appointmentLength, setAppointmentLength] = useState(0);
  const [pendingLength, setPendingLength] = useState(0);
  const [approvedLength, setApprovedLength] = useState(0);
  const [reschedLength, setReschedLength] = useState(0);
  const [cancelledLength, setCancelledLength] = useState(0);
  const [appointments, setAppointments] = useState([]);
  // eslint-disable-next-line
  const [page, setPage] = useState(0);
  // eslint-disable-next-line
  const [rowsPerPage, setRowsPerPage] = useState(1000);

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // get the current time
        if (currentTime > decodedToken.exp) {
            localStorage.removeItem("token");
            alert("Token expired, please login again");
            navigate('/');
        }
    } else if (!isLoggedIn) {
        navigate('/');
    }
}, [isLoggedIn, navigate]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost/appointment_api_admin/count_appointment.php";
        const response = await axios.get(url);
        if (response.data.hasOwnProperty("length")) {
          setAppointmentLength(response.data.length);
        }
      } catch (e) {
        alert(e);
      }
    };
    fetchData();
  }, [appointmentLength]);

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost/appointment_api_admin/read_appointments.php";
      let fData = new FormData();
      fData.append("status", "Pending");

      const response = await axios.post(url, fData);
      if(response.data.hasOwnProperty("length")){
        setPendingLength(response.data.length);
      }
    }
    fetchData();
  },[pendingLength])

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost/appointment_api_admin/read_appointments.php";
      let fData = new FormData();
      fData.append("status", "Approved");

      const response = await axios.post(url, fData);
      if(response.data.hasOwnProperty("length")){
        setApprovedLength(response.data.length);
      }
    }
    fetchData();
  },[approvedLength])

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost/appointment_api_admin/read_appointments.php";
      let fData = new FormData();
      fData.append("status", "Rescheduled");

      const response = await axios.post(url, fData);
      if(response.data.hasOwnProperty("length")){
        setReschedLength(response.data.length);
      }
    }
    fetchData();
  },[reschedLength])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost/appointment_api_admin/read_appointments.php";
        let fData = new FormData();
        fData.append("status", "Pending");

        const response = await axios.post(url, fData);

        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        }
      } catch (e) {
        alert(e);
      }
    };

    fetchData();
  }, [appointments]);

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost/appointment_api_admin/read_appointments.php";
      let fData = new FormData();
      fData.append("status", "Cancelled");

      const response = await axios.post(url, fData);
      if(response.data.hasOwnProperty("length")){
        setCancelledLength(response.data.length);
      }
    }
    fetchData();
  },[cancelledLength])

  useEffect(() => {
    const fetchData = async () => {
      try{
        const url = "http://localhost/appointment_api/unavailable_dates.php";
        const response = await axios.get(url);
        if(Array.isArray(response.data)){
          setUnavailableDates(response.data.map(dateObj => dateObj.unavailable_date));
        }
      }catch(e){
        alert(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const url = "http://localhost/appointment_api/available_dates.php";
        const response = await axios.get(url);
        if(Array.isArray(response.data)){
          const timeSlots = response.data.map(dateObj => ({
            date: dateObj.available_date,
            start_time: dateObj.start_time,
            end_time: dateObj.end_time
          }));
          setAvailableDates(response.data.map(dateObj => dateObj.available_date));
          setAvailableTimeSlots(timeSlots);
        }
      }catch(e){
        alert(e);
      }
    }
    fetchData();
  }, []);

  const handleTimeSlotClick = timeSlot => {
    setSelectedTimeSlot(timeSlot);
  };

  // Calculate the starting and ending indexes based on pagination
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <div>
      <Header />
      <div className="boxContainer">
        <div className="box">
          <div className="title">Appointments</div>
          <div className="value">{appointmentLength}</div>
          <div className="icon"><FcViewDetails/></div>
        </div>
        <div className="box">
          <div className="title">Pending</div>
          <div className="value">{pendingLength}</div>
          <div className="icon"><FcMinus/></div>
        </div>
        <div className="box">
          <div className="title">Approved</div>
          <div className="value">{approvedLength}</div>
          <div className="icon"><FcOk/></div>
        </div>
        <div className="box">
          <div className="title">Rescheduled</div>
          <div className="value">{reschedLength}</div>
          <div className="icon"><FcCalendar/></div>
        </div>
        <div className="box">
          <div className="title">Cancelled</div>
          <div className="value">{cancelledLength}</div>
          <div className="icon"><FcCancel/></div>
        </div>
      </div>
      <div className="belowContainerTitle">
        <div className="tbox1">Calendar</div>
        <div className="tbox2">Recent Appointments</div>
      </div>
      <div className="belowContainer">
        <div className="box1">
          <Calendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            availableDates={availableDates}
            unavailableDates={unavailableDates}
            availableTimeSlots={availableTimeSlots}
            handleTimeSlotClick={handleTimeSlotClick}
            selectedTimeSlot={selectedTimeSlot}
            className="custom-calendar"
          />
        </div>
        <div className="box2">
          <TableContainer>
            <div className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ color: '#fff' }}>No.</TableCell>
                  <TableCell align="center" style={{ color: '#fff' }}>Name</TableCell>
                  <TableCell align="center" style={{ color: '#fff' }}>Department</TableCell>
                  <TableCell align="center" style={{ color: '#fff' }}>Date</TableCell>
                  <TableCell align="center" style={{ color: '#fff' }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments
                  .slice(startIndex, endIndex)
                  .map((appointment, index) => (
                    <TableRow key={appointment.id}>
                      <TableCell align="center" style={{ color: '#000' }}>{index + 1}.</TableCell>
                      <TableCell align="center">{appointment.name}</TableCell>
                      <TableCell align="center">{appointment.department}</TableCell>
                      <TableCell align="center">{appointment.selectedDate}</TableCell>
                      <TableCell align="center">{appointment.selected_time}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            </div>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
