import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Organization() {
  const [orgId, setOrgId] = useState('');
  const [orgName, setOrgName] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [trashOrganizations, setTrashOrganizations] = useState([]);
  const token = localStorage.getItem('AccessToken');

  useEffect(() => {
    fetchOrganizations();
    fetchTrashOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/organization/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchTrashOrganizations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/trashorganization/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrashOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching trash organizations:', error);
    }
  };

  const handleAdd = async () => {
    if (orgId && orgName) {
      try {
        await axios.post('http://127.0.0.1:5000/api/createorganization/', { id: orgId, name: orgName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrganizations();
        setOrgId('');
        setOrgName('');
      } catch (error) {
        console.error('Error adding organization:', error);
        alert('Failed to add organization');
      }
    } else {
      alert('Please enter both Organization ID and Name');
    }
  };

  const handleUpdate = async () => {
    if (orgId && orgName) {
      try {
        await axios.put(`http://127.0.0.1:5000/api/organization/${orgId}/`, { name: orgName }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrganizations();
        setOrgId('');
        setOrgName('');
      } catch (error) {
        console.error('Error updating organization:', error);
        alert('Failed to update organization');
      }
    } else {
      alert('Please enter Organization ID to update');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/deleteorganization/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrganizations();
        fetchTrashOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
        alert('Failed to delete organization');
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:5000/api/restoreorganization/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrganizations();
      fetchTrashOrganizations();
    } catch (error) {
      console.error('Error restoring organization:', error);
      alert('Failed to restore organization');
    }
  };

  const handleEdit = (org) => {
    setOrgId(org.id);
    setOrgName(org.name);
  };

  return (
    <div className="container mt-4">
      <h1>Organization</h1>
      <div className="mb-3">
        <label className="form-label">Organization Id</label>
        <input
          type="text"
          className="form-control"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
          placeholder="Enter Organization ID"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Organization Name</label>
        <input
          type="text"
          className="form-control"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Enter Organization Name"
        />
      </div>
      <button className="btn btn-primary me-2" onClick={handleAdd}>
        Add
      </button>
      <button className="btn btn-warning" onClick={handleUpdate}>
        Update
      </button>

      <div className="mt-4">
        <h3>Organizations List</h3>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org, index) => (
              <tr key={index}>
                <td>{org.id}</td>
                <td>{org.name}</td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => handleEdit(org)}>Update</button>
                  <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(org.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h3>Trash Organizations List</h3>
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trashOrganizations.map((org, index) => (
              <tr key={index}>
                <td>{org.id}</td>
                <td>{org.name}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => handleRestore(org.id)}>Restore</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Organization;
