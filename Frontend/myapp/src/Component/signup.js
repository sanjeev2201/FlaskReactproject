// import React, {useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './signup.css';
import axios from "axios";
import { useEffect, useState } from "react";
const Signup = () => {
  const [username, setUsername] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [email, setEmail] = useState('');
  const [rolesList, setRolesList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    debugger;
    axios.get("http://127.0.0.1:5000/api/role/").then((response) => {
            setRolesList(response.data);
          }).catch((error) => {
              console.error("Error fetching roles:", error);
          });
         }, []);

useEffect(() => {
  axios.get("http://127.0.0.1:5000/api/organization/").then((response) => {
      setOrganizations(response.data);
    }
  ).catch((error) => {
      console.error("Error fetching organizations:", error);
    });
}, []);

  /* ROLE HANDLER */
  const handleRoleChange = (e) => {
    const roleId = Number(e.target.value);

    if (e.target.checked) {
      setRoles([...roles, roleId]);
    } else {
      setRoles(roles.filter((id) => id !== roleId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const payload = {
      username,
      email,
      password,
      organization: Number(organization),
      roles
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/signup/Register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Registration successful! Redirecting to login...', {
          autoClose: 3000,
        });

        setTimeout(() => navigate('/login'), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className='bodybooking'>
      <div className="login-container">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input type="text"  value={username} onChange={(e) => setUsername(e.target.value)}
            required  placeholder="Enter your username"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />

         
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

         
          <div className="roles-group-inline">
            <span className="roles-title">Roles:</span>

                  {rolesList.map((role) => (
                    <label className="role-inline" key={role.id}>
                      <input
                        type="checkbox"
                        value={role.id}
                        checked={roles.includes(role.id)}
                        onChange={handleRoleChange}
                      />
                      <span>{role.name}</span>
                    </label>
                  ))}

            {/* <label className="role-inline">
              <input type="checkbox" value="3" onChange={handleRoleChange} />
              <span>Manager</span>
            </label> */}
          </div>



          <div className='password-input'>
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Password"
            />
            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className='password-input'>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
            />
            <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              {confirmPasswordVisible ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit">Register</button>
          <p>Already have an account? <a href="/login">Login</a></p>

        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
