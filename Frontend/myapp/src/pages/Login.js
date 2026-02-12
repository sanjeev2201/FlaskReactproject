import React, { useState } from 'react';
import './Login.css'; // Custom styling for Login
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post('http://127.0.0.1:8000/api/login/', { email, password });

      if (response.status === 200) {
        debugger;
        const accesstoken = response.data.access; // Assuming the token is in response.data.token
        const referencetoken = response.data.refresh;
        // Store the token in localStorage
        localStorage.setItem('AccessToken', accesstoken);
        localStorage.setItem('RefreshToken', referencetoken);
        // Redirect to a protected route
        navigate('/');
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="bodylogin">
      <div className="login-container">
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group password-input">
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="toggle-password"
              >
                {passwordVisible ? 'Hide' : 'Show'}
              </button>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <p>
            Don't have an account? <a href="/Signup">Register</a>
                      <p>
            Forget password? <a href="/Resetpassword">Forget password</a>
          </p>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
