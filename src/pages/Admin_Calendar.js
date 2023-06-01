import React, { useState, useEffect } from "react";
import Header from "../utils/Header";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Calendar from "../utils/Calendar";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import './Calendar_Components/AdminCalendar.css';
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';

export default function AdminCalendar() {
  const navigate = useNavigate();
  const isLoggedIn = useAuth(); 
  const [availability, setAvailability] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedDateDetails, setSelectedDateDetails] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const UID = uuidv4();

  const [addDate, setAddDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [avDates, setAvDates] = useState([]);
  const [unAvDates, setUnAvDates] = useState([]);
  const [showAvailableDates, setShowAvailableDates] = useState(true);
  const [searchValue, setSearchValue] = useState('');

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
    const fetchUnavailableDates = async () => {
      try {
        const url = "http://localhost/appointment_api/unavailable_dates.php";
        const response = await axios.get(url);
        if (Array.isArray(response.data)) {
          setUnavailableDates(response.data.map(dateObj => dateObj.unavailable_date));
          setUnAvDates(response.data);
        }
      } catch (e) {
        alert(e);
      }
    }
    fetchUnavailableDates();
  }, [unavailableDates]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const url = "http://localhost/appointment_api/available_dates.php";
        const response = await axios.get(url);
        if (Array.isArray(response.data)) {
          setAvDates(response.data);
          const timeSlots = response.data.map(dateObj => ({
            id: dateObj.id,
            date: dateObj.available_date,
            start_time: dateObj.start_time,
            end_time: dateObj.end_time
          }));
          setAvailableDates(response.data.map(dateObj => dateObj.available_date));
          setAvailableTimeSlots(timeSlots);
        }
      } catch (e) {
        alert(e);
      }
    }
    fetchAvailableDates();
  }, [availableDates]);

  const handleTimeSlotClick = timeSlot => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenViewModal = (date) => {
    setSelectedDateDetails(date);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };

  const handleOpenEditModal = (date) => {
    setSelectedDateDetails(date);
    setEditStartTime(date.start_time);
    setEditEndTime(date.end_time);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const submitAvailability = async () => {
    try {
      const url = "http://localhost/appointment_api_admin/add_availability.php";
      let fData = new FormData();
      fData.append("UID", UID);
      fData.append("addDate", dayjs(addDate, "YYYY/MM/DD").format("YYYY/MM/DD"));
      fData.append("availability", availability);
      if(availability === "Available"){
        fData.append("startTime", dayjs(startTime, "HH:mm").format("HH:mm"));
        fData.append("endTime", dayjs(endTime, "HH:mm").format("HH:mm"));
      }

      const response = await axios.post(url, fData);
      if (response.data.message === "Success") {
        alert(`${availability} date added successfully!`);
      } else {
        alert("Error adding availability!");
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleUpdateAvailability = async (id) => {
    try {
      const url = "http://localhost/appointment_api_admin/update_availabledate.php";
      let fData = new FormData();
      fData.append("id", id);
      fData.append("start_time", dayjs(editStartTime, "HH:mm").format("HH:mm"));
      fData.append("end_time", dayjs(editEndTime, "HH:mm").format("HH:mm"));

      const response = await axios.post(url, fData);
      console.log(id);
      if (response.data.message === "Success") {
        alert("Availability updated successfully!");
      } else {
        alert("Error updating availability!");
      }
      handleCloseEditModal();
    } catch (e) {
      alert(e);
    }
  };

  const handleDeleteAvailability = async (id) => {
    try {
      const url = `http://localhost/appointment_api_admin/delete_availabledate.php`;
      let fData = new FormData();
      fData.append("id", id)

      const response = await axios.post(url, fData);
      if (response.data.message === "Success") {
        alert("Availability deleted successfully!");
      } else {
        alert("Error deleting availability!");
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleDeleteUnavailability = async (id) => {
    try {
      const url = `http://localhost/appointment_api_admin/delete_unavailabledate.php`;
      let fData = new FormData();
      fData.append("id", id)

      const response = await axios.post(url, fData);
      if (response.data.message === "Success") {
        alert("Availability deleted successfully!");
      } else {
        alert("Error deleting availability!");
      }
    } catch (e) {
      alert(e);
    }
  };

  

  const handleShowAvailableDates = () => {
    setShowAvailableDates(!showAvailableDates);
  };

  const handleSearchChange = event => {
    setSearchValue(event.target.value);
  };

  const filteredAvDates = avDates.filter(date => {
    const searchLower = searchValue.toLowerCase();
    return (
      date.available_date?.toLowerCase().includes(searchLower) ||
      date.start_time?.toLowerCase().includes(searchLower) ||
      date.end_time?.toLowerCase().includes(searchLower)
    );
  });

  const filteredUnAvDates = unAvDates.filter(date => {
    const searchLower = searchValue.toLowerCase();
    return (
      date.unavailable_date?.toLowerCase().includes(searchLower) ||
      date.start_time?.toLowerCase().includes(searchLower) ||
      date.end_time?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div>
      <Header />
      <div className="main-cont">
        <div className="child-cont">
          <Button variant="contained" onClick={handleOpenModal}>
            Add Availability
          </Button>
        </div>
        <div className="child-cont1">
          <Button variant="contained" onClick={handleShowAvailableDates}>
            {showAvailableDates ? 'Show Unavailable Dates' : 'Show Available Dates'}
          </Button>
        </div>
        <div className="child-cont2">
          <TextField
            label="Search"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
          />
        </div>
      </div>
      <div className="sub-cont">
        <div className="child-subcont1">
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
        <div className="child-subcont2">
          {showAvailableDates ? (
            <TableContainer className="table-container">
              <Table stickyHeader>
                <TableHead className="tablehead">
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      Available Dates
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Start Time</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>End Time</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAvDates.map(date => (
                    <TableRow key={date.id}>
                      <TableCell align="center">{date.available_date}</TableCell>
                      <TableCell align="center">{date.start_time}</TableCell>
                      <TableCell align="center">{date.end_time}</TableCell>
                      <TableCell align="center">
                        <Button onClick={() => handleOpenViewModal(date)}>View</Button>
                        <Button onClick={() => handleOpenEditModal(date)}>Edit</Button>
                        <Button onClick={() => handleDeleteAvailability(date.date_id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer className="table-container">
              <Table stickyHeader>
                <TableHead className="tablehead">
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      Unavailable Dates
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Start Time</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>End Time</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUnAvDates.map(date => (
                    <TableRow key={date.id}>
                      <TableCell align="center">{date.unavailable_date}</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">
                        <Button onClick={() => handleDeleteUnavailability(date.date_id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <FormControl fullWidth sx={{ marginBottom: '20px' }}>
            <InputLabel id="department-label">Availability</InputLabel>
            <Select
              value={availability}
              label="Availability"
              onChange={(e) => setAvailability(e.target.value)}
              sx={{ marginBottom: '20px' }} // Add spacing to the Select component
            >
              <MenuItem value={"Available"}>Available</MenuItem>
              <MenuItem value={"Unavailable"}>Unavailable</MenuItem>
            </Select>
            <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                defaultValue={dayjs()}
                onChange={(date) => setAddDate(date)}
                format="YYYY/MM/DD" // Set the format to "year/mm/dd"
                sx={{ marginBottom: '20px' }} // Add spacing to the DesktopDatePicker component
              />
            </LocalizationProvider>
            {availability === "Available" && (
              <>
                <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                  <DesktopTimePicker
                    defaultValue={dayjs('2022-04-17T15:30')}
                    value={startTime}
                    label="Start Time"
                    onChange={(time) => setStartTime(time)}
                    sx={{ marginBottom: '20px' }} // Add spacing to the DesktopTimePicker component
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopTimePicker
                    value={endTime}
                    onChange={(time) => setEndTime(time)}
                    sx={{ marginBottom: '20px' }} // Add spacing to the DesktopTimePicker component
                  />
                </LocalizationProvider>
              </>
            )}
            <Button variant="contained" onClick={submitAvailability}>Submit</Button>
          </FormControl>

        </Box>
      </Modal>
      <Modal
        open={openViewModal}
        onClose={handleCloseViewModal}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          {selectedDateDetails && (
            <div>
              <h2>Date: {selectedDateDetails.available_date}</h2>
              <p>Start Time: {selectedDateDetails.start_time}</p>
              <p>End Time: {selectedDateDetails.end_time}</p>
            </div>
          )}
        </Box>
      </Modal>
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          {selectedDateDetails && (
            <div>
              <h2>Date: {selectedDateDetails.available_date}</h2>
              <FormControl fullWidth style={{marginTop: '5%'}}>
              <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                <DesktopTimePicker
                  value={editStartTime}
                  onChange={(time) => setEditStartTime(time)}
                  label="Start Time"
                  sx={{ marginBottom: '20px' }}
                />
              </LocalizationProvider>
              <LocalizationProvider fullWidth dateAdapter={AdapterDayjs}>
                <DesktopTimePicker
                  value={editEndTime}
                  onChange={(time) => setEditEndTime(time)}
                  label="End Time"
                  sx={{ marginBottom: '20px' }}
                  
                />
              </LocalizationProvider>
              <Button fullWidth variant="contained" onClick={() => handleUpdateAvailability(selectedDateDetails.date_id)}>Update</Button>
              </FormControl>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
