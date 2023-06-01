import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ViewModal({ appointment, onClose }) {
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>View Appointment</DialogTitle>
      <DialogContent>
        <p>Name: {appointment.name}</p>
        <p>Purpose: {appointment.purpose}</p>
        <p>Department: {appointment.department}</p>
        <p>Personnel: {appointment.personnel}</p>
        <p>Selected Date: {appointment.selectedDate}</p>
        <p>Selected Time: {appointment.selected_time}</p>
        {appointment.status === "Cancelled" || appointment.status === "Rescheduled" ? <p>Reason: {appointment.reason}</p> : ""}
        <p>Status: {appointment.status}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
