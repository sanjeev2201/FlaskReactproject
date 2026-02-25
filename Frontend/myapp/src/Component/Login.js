import './Login.css'; // Custom styling for Login
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login/', {email,password,organization});
      if (response.status === 200) {
        debugger;
        const accesstoken = response.data.access_token; 
        localStorage.setItem('AccessToken', accesstoken);
        localStorage.setItem('RefreshToken', response.data.refresh_token);
        localStorage.setItem('role', response.data.roles[0]);
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

  useEffect(() => {
  axios.get("http://127.0.0.1:5000/api/organization/").then((response) => {
      setOrganizations(response.data);
    }
  ).catch((error) => {
      console.error("Error fetching organizations:", error);
    });
}, []);

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
