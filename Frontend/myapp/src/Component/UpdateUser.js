import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
// import './updateuser.css'
function UpdateUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load user
    api.get(`/api/users/${id}`)
      .then((res) => {
        const data = res.data;

        setUsername(data.username);
        setEmail(data.email);
        setOrganization(data.organization_id);

        // 🔥 IMPORTANT FIX
        setRoles(data.roles.map(r => Number(r)));
      })
      .catch((err) => console.error(err));

    // Load organizations
    api.get("/signup/organization/")
      .then((res) => setOrganizations(res.data))
      .catch((err) => console.error(err));

    // Load roles
    api.get("/signup/role/")
      .then((res) => setRolesList(res.data))
      .catch((err) => console.error(err));

  }, [id]);

  const handleRoleChange = (e) => {
    const roleId = Number(e.target.value);

    if (e.target.checked) {
      setRoles(prev => [...prev, roleId]);
    } else {
      setRoles(prev => prev.filter(r => r !== roleId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      username,
      email,
      organization_id: Number(organization),
      roles
    };

    try {
      await api.put(`/api/users/${id}`, payload);

      toast.success("User updated successfully!");
      setTimeout(() => navigate("/Employee"), 1500);

    } catch (err) {
      setError("Update failed");
    }
  };

  return (
        <div className="bodybooking">
            <div className="login-container">
          <h2>Update User</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} className="login-form">

                <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                </div>

                <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>

                <div className="form-group">
                <label>Organization</label>
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
                </div>

                 <div className="roles-group-inline">
                        <label>Roles</label>
                        <div className="role-inline">
                            {rolesList.map((role) => (
                            <label key={role.id} className="role-inline" >
                                <input
                                type="checkbox"
                                value={role.id}
                                checked={roles.includes(Number(role.id))}
                                onChange={handleRoleChange}
                                />
                                <span>{role.name}</span>
                            </label>
                            ))}
                        </div>
                </div>

                <button type="submit" className="btn-primary">
                Update User
                </button>
            </form>
            </div>
        </div>
  )}

export default UpdateUser;
