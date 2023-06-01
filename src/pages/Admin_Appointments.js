import React, { useState, useEffect } from "react";
import Header from "../utils/Header";
import axios from "axios";
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import dayjs from 'dayjs';
import './Appointments_Components/Appointments.css'
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";


export default function Appointments() {
  const navigate = useNavigate();
  const isLoggedIn = useAuth(); 
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedSelectedDate, setUpdatedSelectedDate] = useState(null);
  const [updatedSelectedTime, setUpdatedSelectedTime] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [reschedReason, setReschedReason] = useState("");

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleView = (appointment) => {
    setIsCancelOpen(true);
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
    setIsDatePickerOpen(false); // Close the date picker dialog
  };

  const approveStatus = async (id) => {
    const shouldApprove = window.confirm("Are you sure you want to approve this appointment?");
    if (shouldApprove) {
      try {
        const url = "http://localhost/appointment_api_admin/approve_status.php";
        let fData = new FormData();
        fData.append("id", id);

        const response = await axios.post(url, fData);

        if (response.data.message === "Success") {
          alert("You have approved this appointment!");
        } else {
          alert("Cannot update this appointment!");
        }

      } catch (e) {
        alert(e);
      }
    }
  };

  const cancelStatus = async (id) => {
    setIsCancelOpen(true);
    const shouldCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (shouldCancel) {
      const reason = prompt("Please enter the cancellation reason:");
      if (reason) {
        setCancellationReason(reason);
        try {
          const url = "http://localhost/appointment_api_admin/cancel_status.php";
          let fData = new FormData();
          fData.append("id", id);
          fData.append("reason", reason);

          const response = await axios.post(url, fData);

          if (response.data.message === "Success") {
            alert("You have cancelled this appointment!");
          } else {
            alert("Cannot update this appointment!");
          }

        } catch (e) {
          alert(e);
        }
      } else {
        alert("Please provide a cancellation reason.");
      }
    }
  };

  const reschedStatus = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
    setIsDatePickerOpen(true); // Open the date picker dialog
    setUpdatedSelectedDate(dayjs(appointment.selectedDate)); // Convert selected date to Dayjs object
    setUpdatedSelectedTime(dayjs(appointment.selectedTime)); // Set initial value of updated time to current selected time
  };

  const handleReschedule = async () => {
    try {
      const id = selectedAppointment.appointment_id;
      const selectedDate = updatedSelectedDate.format('YYYY-MM-DD'); // Convert to date-only format
      const selectedTime = updatedSelectedTime.format('HH:mm:ss'); // Keep the time component
      const url = "http://localhost/appointment_api_admin/reschedule_status.php";
    
      let fData = new FormData();
      fData.append("id", id);
      fData.append("selectedDate", selectedDate);
      fData.append("selectedTime", selectedTime);
      fData.append("status", "Rescheduled");
      fData.append("reason", reschedReason);

      const response = await axios.post(url, fData);
      if (response.data.message === "Success") {
        alert("Appointment rescheduled successfully!");
        setIsModalOpen(false); // Close the modal after successful rescheduling
      } else {
        alert("Cannot update this appointment!");
      }

    } catch (e) {
      alert(e);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCancellationReason("");
  };

  const handleChangeDatePicker = (date) => {
    setUpdatedSelectedDate(date);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const name = appointment.name.toLowerCase();
    const department = appointment.department.toLowerCase();
    const personnel = appointment.personnel.toLowerCase();
    const selectedDate = appointment.selectedDate.toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      name.includes(query) ||
      department.includes(query) ||
      personnel.includes(query) ||
      selectedDate.includes(query)
    );
  });

  return (
    <div>
      <Header />
      <div className="main-container">
        <div className="search">
          <TextField
            label="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  Name
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  Department
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  Selected Date
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  Status
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", backgroundColor: "#f0f0f0" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => (
                  <TableRow key={appointment.appointment_id}>
                    <TableCell align="center">{appointment.name}</TableCell>
                    <TableCell align="center">{appointment.department}</TableCell>
                    <TableCell align="center">{appointment.selectedDate}</TableCell>
                    <TableCell align="center">{appointment.status}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleView(appointment)}>View</Button>
                      <Button onClick={() => approveStatus(appointment.appointment_id)}>Approve</Button>
                      <Button onClick={() => reschedStatus(appointment)}>Reschedule</Button>
                      <Button onClick={() => cancelStatus(appointment.appointment_id)}>Cancel</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 7]}
          component="div"
          count={filteredAppointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          {isDatePickerOpen ? <DialogTitle>Reschedule Appointment</DialogTitle> : <DialogTitle>View Details</DialogTitle>}
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {isDatePickerOpen ? (
                <div>
                  <div style={{ marginBottom: '10px', marginTop: '10px' }}>
                    <DatePicker
                      label="Select Date"
                      value={updatedSelectedDate}
                      onChange={handleChangeDatePicker}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div>
                    <TimePicker
                      label="Select Time"
                      value={updatedSelectedTime}
                      onChange={(newTime) => setUpdatedSelectedTime(newTime)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <TextField
                      label="Reschedule Reason"
                      value={reschedReason}
                      onChange={(e) => setReschedReason(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {/* Render the appointment details */}
                  <p>Name: {selectedAppointment.name}</p>
                  <p>Purpose: {selectedAppointment.purpose}</p>
                  <p>Department: {selectedAppointment.department}</p>
                  <p>Personnel: {selectedAppointment.personnel}</p>
                  <p>Selected Date: {selectedAppointment.selectedDate}</p>
                  <p>Selected Time: {selectedAppointment.selected_time}</p>
                  <p>Status: {selectedAppointment.status}</p>
                  {isCancelOpen ? "" : (
                    <TextField
                      label="Cancellation Reason"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                  )}
                </div>
              )}
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            {isDatePickerOpen && (
              <Button onClick={handleReschedule}>Reschedule</Button>
            )}
            <Button onClick={handleCloseModal}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
