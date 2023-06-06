import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Auth_Components/Login.css'

const theme = createTheme();

export default function Login() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/AdminDashboard");
    }
  }, [navigate]);


  const signIn = async () => {
    const url = "http://localhost/appointment_api_admin/login.php";

    let fData = new FormData();
    fData.append("username", username);
    fData.append("password", password);

    try {
      const response = await axios.post(url, fData);
      console.log(response.data);

      if (response.data.message !== "Success") {
        console.log("Login failed:", response.data.message);
        alert(response.data.message);
        return;
      }

      // Save the JWT token in the local storage
      const jwtToken = await response.data.token;

      if (response.data.message === "Success") {
        alert("Login Successful");
        localStorage.setItem("token", jwtToken);
        navigate("/AdminDashboard", { replace: true });
      } else {
        alert("User does not exist");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="login-container">
        <div className="column-right">
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100%',
                marginBottom: '20%'
              }}
            >
              <img
              src="/images/logo.png"
              alt="logo"
              style={{ height: '70px', marginRight: '8px', marginBottom: '20px' }}
              />
              <Typography component="h1" variant="h5">
                APPOINTMENT SYSTEM ADMIN
              </Typography>
              <TextField
                onChange={e => setusername(e.target.value)}
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                onChange={e => setPassword(e.target.value)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                onClick={signIn}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              
            </Box>
          </Container>
          
        </div>
      </div>
    </ThemeProvider>
    
  );
}
