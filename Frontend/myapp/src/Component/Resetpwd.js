import React, { useState , useEffect } from 'react';
import './Login.css'; // Custom styling for Login
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Resetpassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  axios.get("http://127.0.0.1:5000/api/organization/").then((response) => {
      setOrganizations(response.data);
    }
  ).catch((error) => {
      console.error("Error fetching organizations:", error);
    });
}, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Send reset password request to the backend
      const response = await axios.post('http://127.0.0.1:5000/auth/resetpwd/', { email, password, organization });
      const message = response.data['message'];
      toast.success(message, {
        autoClose: 5000,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Error resetting password. Please try again.');
    }
  };

  return (
    <div className="bodylogin">
      <div className="login-container">
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleResetPassword} className="login-form">
          <h2>Reset Password</h2>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
           <select
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          required
        >
          <option value="">Select Organization</option>

          {organizations.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
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
              Reset Password
            </button>
          </div>
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Resetpassword;
