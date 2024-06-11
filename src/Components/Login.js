import React, { useState, useContext } from 'react';
import "./Login.css";
import { Button, TextField, Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import config from './Config';

const Login = () => {
  const { handleLogin } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleLoginRequest = async () => {
    setLoading(true); // Set loading to true when the request starts
    try {
      const requestBody = { username };

      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(requestBody).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        handleLogin(data.user, data.access_token, data.user_id, username);
        console.log(data.user_id);
        console.log(username);
        if (response.status === 200) {
          navigate("/");
        }
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error during login:', error);
    } finally {
      setLoading(false); // Set loading to false when the request finishes
    }
  };

  return (
    <Container component="main" className="main-container">
      <Box className="login-box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5" style={{ fontWeight: 'bold', color: '#3F2A7E' }}>
  Login
</Typography>
        <Box component="form" onSubmit={(e) => { e.preventDefault(); handleLoginRequest(); }} sx={{ mt: 1 }}>
          <TextField
            className='login-textfield'
            margin="normal"
            required
            
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            className='login-button'
            type="submit"
          
            variant="contained"
            sx={{ mt: 3, mb: 2, opacity: loading ? 0.5 : 1 }}
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
