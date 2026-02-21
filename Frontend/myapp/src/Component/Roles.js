import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Roles() {
  const [roleId, setRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [trashRoles, setTrashRoles] = useState([]);
  const token = localStorage.getItem('AccessToken');

  useEffect(() => {
    fetchRoles();
    fetchTrashRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/role/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchTrashRoles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/trashrole/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrashRoles(response.data);
    } catch (error) {
      console.error('Error fetching trash roles:', error);
    }
  };

  const handleAdd = async () => {
    if (roleId && roleName) {
      try {
        await axios.post('http://127.0.0.1:5000/api/createrole/', { id: roleId, name: roleName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRoles();
        setRoleId('');
        setRoleName('');
      } catch (error) {
        console.error('Error adding role:', error);
        alert('Failed to add role');
      }
    } else {
      alert('Please enter both Role ID and Name');
    }
  };

  const handleUpdate = async () => {
    if (roleId && roleName) {
      try {
        await axios.put(`http://127.0.0.1:5000/api/roles/${roleId}/`, { name: roleName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRoles();
        setRoleId('');
        setRoleName('');
      } catch (error) {
        console.error('Error updating role:', error);
        alert('Failed to update role');
      }
    } else {
      alert('Please enter Role ID to update');
    }
  };

  const handleEdit = (role) => {
    setRoleId(role.id);
    setRoleName(role.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/deleterole/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchRoles();
        fetchTrashRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Failed to delete role');
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:5000/api/restorerole/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRoles();
      fetchTrashRoles();
    } catch (error) {
      console.error('Error restoring role:', error);
      alert('Failed to restore role');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Roles</h1>
      <div className="mb-3">
        <label className="form-label">Role Id</label>
        <input
          type="text"
          className="form-control"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          placeholder="Enter Role ID"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Role Name</label>
        <input
          type="text"
          className="form-control"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Enter Role Name"
        />
      </div>
      <button className="btn btn-primary me-2" onClick={handleAdd}>
        Add
      </button>
      <button className="btn btn-warning" onClick={handleUpdate}>
        Update
      </button>

      <div className="mt-4">
        <h3>Roles List</h3>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={index}>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => handleEdit(role)}>Update</button>
                  <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(role.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3>Trash Roles List</h3>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trashRoles.map((role, index) => (
              <tr key={index}>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => handleRestore(role.id)}>Restore</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Roles;
