import React, { useState, useEffect } from "react";
import Header from "../../utils/Header";
import axios from "axios";
import Button from '@mui/material/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import ViewModal from "./Appointments_ViewModal";

export default function Approved() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost/appointment_api_admin/read_appointments.php";
        let fData = new FormData();
        fData.append('status', 'Approved');

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
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      <TextField
        label="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
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
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredAppointments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {isModalOpen && (
        <ViewModal appointment={selectedAppointment} onClose={handleCloseModal} />
      )}
    </div>
  );
}
