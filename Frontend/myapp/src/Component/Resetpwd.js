import React, { useState } from 'react';
import './Login.css'; // Custom styling for Login
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Resetpassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post('http://127.0.0.1:5000/auth/resetpwd/', { email, password });
      if (response.status === 200) {
        // Redirect to a protected route
        navigate('/login');
      }
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'reset password failed');
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
          <h2>Forget Password</h2>
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
            Already have an account? <a href="/login">login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
