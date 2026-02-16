// src/App.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [CountAllEmployees, setCountAllEmployees] = useState([]);
  const [CountAactiveEmployees, setCountActiveEmployees] = useState([]);
  const [CountTrashEmployees, setCountTrashEmployees] = useState([]);
  const [TrashAllusers,setTrashAllusers] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const itemsPerPage = 5; // Number of items per page

  
  const navigate = useNavigate();
  const token = localStorage.getItem('AccessToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  else{
    navigate("/login"); 
  }


  const fetchAllEmployees = async (page = 1) => {
    debugger;
    setLoading(true);
    setError(null);
    try{
      debugger;
      const response = await axios.get("http://127.0.0.1:5000/api/dashboard/", {
        params: { page, per_page: itemsPerPage },
      });
      const responseData = response.data.data;
      setEmployees(responseData.data);
      setCountAllEmployees(responseData.AllUsers);
      setCountActiveEmployees(responseData.ActiveUsers);
      setCountTrashEmployees(responseData.TrashUsers);
      setTrashAllusers(responseData.TrashAllusers);
      setCurrentPage(responseData.current_page);
      setTotalPages(responseData.pages);
    }catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  }, []);


  const handleUpdate = (employee) => {
    setSelectedEmployee(employee);

    const modalElement = document.getElementById('updateModal');
    const modal = new Modal(modalElement);
    modal.show();
  };


  const saveChanges = () => {
    if (selectedEmployee) {
      axios.put(`http://127.0.0.1:5000/api/EmployeeUser/${selectedEmployee.id}/`, selectedEmployee)
      
        .then(response => {
          debugger;
          const message = response.data['message'];
          toast.success(message, {
            autoClose: 5000,
          });
          fetchAllEmployees();
          const modalElement = document.getElementById('updateModal');
          const modal = Modal.getInstance(modalElement);
          modal.hide();
        })
        .catch(error => {
          console.error('Error updating employee:', error);
          toast.error('An error occurred while updating the employee.');
        });
    }
  };


  const handleDelete = (emp_id) => {
    debugger;
    axios.delete(`http://127.0.0.1:5000/api/deletebyadmin/${emp_id}`)
      .then(response => {
        const message = response.data['message'];
        toast.error(message, {
            autoClose: 5000,
          });
        fetchAllEmployees();
      })
      .catch(error => {
        console.error('Error deleting employee:', error);
        toast.error('Error deleting employee Please try again.');
      });
  };
  const handleRestore = (emp_id) => {
    debugger;
    axios.patch(`http://127.0.0.1:5000/api/restorebyadmin/${emp_id}`)
      .then(response => {
        const message = response.data['message'];
        toast.success(message, {
            autoClose: 5000,
          });
        fetchAllEmployees();
      })
      .catch(error => {
        console.error('Error restore employee:', error);
        toast.error('Error restore employee Please try again.');
      });
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

 // Handle page change
 const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
    fetchAllEmployees(newPage);
  }
};

const role = localStorage.getItem("role");


  return (
    <div className="Dashboard">
      <header className="navbar navbar-expand-lg navbar-dark bg-primary">
      {role === "Admin" && (
                <>
                <Link className="navbar-brand" to="/Master">Master</Link>
                <Link className="navbar-brand" to="/Employee">Employee</Link>
              </>
            )}

      {role === "Employee" && (
        <Link className="navbar-brand" to="/Employee">Master</Link>
      )}
       
 
        <a className="navbar-brand" href="/Logout">Logout</a>

      </header>

      <div className="container mt-4">
        {role === 'Admin' ? <h1>Admin Dashboard</h1> : <h1>Employee Dashboard</h1>}
        
        
        {role==='Admin' && (
        <div className="row">
          <div className="col-md-4">
            <div className="card text-white bg-info mb-3">
              <div className="card-header">All Users</div>
              <div className="card-body">
                <h5 className="card-title"> Available</h5>
                <p className="card-text">Total Users: {CountAllEmployees}</p>
                {/* <p className="card-text">Total rooms: 50</p> */}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3">
              <div className="card-header">Active</div>
              <div className="card-body">
                <h5 className="card-title">Users</h5>
                <p className="card-text"> {CountAactiveEmployees}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-danger mb-3">
              <div className="card-header">Trash</div>
              <div className="card-body">
                <h5 className="card-title">Users</h5>
                <p className="card-text"> {CountTrashEmployees}</p>
              </div>
            </div>
          </div>
        </div>
        )}


        {/* Recent Bookings */}
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Active Users</div>
              <div className="card-body">
                <table className="table table-bordered table-hover">
                  <thead className="thead-light">
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Organization</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody> 
                  {employees.map((employee, index) => (
              <tr key={index}>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.organization.name}</td>
                <td>
                    {employee.roles.map((role) => (
                      <p key={role.id}>{role.name}</p>
                    ))}
                </td>
                <td>
                  
                   {role === "Admin" && (
                    <>
                    <Link to={`/UpdateUser/${employee.id}`} className="btn btn-primary">
                          Update
                        </Link>
                    <button onClick={() => handleDelete(employee.id)} className="btn btn-danger">Delete</button>
                        
                    </>
                      
                    )}
                  {role !=='Admin' && (
                    <button onClick={() => handleUpdate(employee)} className="btn btn-warning">Update</button>
                  )}
                </td>
              </tr>
            ))}

            {role==='Admin' && (
              <> 
                            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            </>
            )}
            



                  </tbody>
                </table>
        <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">Update User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-1">
                  <label htmlFor="username" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={selectedEmployee?.username || ''}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, username: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={selectedEmployee?.email || ''}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={saveChanges}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />

              </div>
            </div>
          </div>
        </div>

            {}
          {role==='Admin' && (
                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header">Trash Users</div>
                      <div className="card-body">
                        <table className="table table-bordered table-hover">
                          <thead className="thead-light">
                            <tr>
                             <th>Username</th>
                            <th>Email</th>
                            <th>Organization</th>
                            <th>Role</th>
                            <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>

                          {TrashAllusers.map((employee, index) => (
                      <tr key={index}>
                        <td>{employee.username}</td>
                        <td>{employee.email}</td>
                        <td>{employee.organization.name}</td>
                        <td>
                          {employee.roles.map((role) => (
                            <p key={role.id}>{role.name}</p>
                          ))}
                </td>
                        <td>
                          
                          <button onClick={() => handleRestore(employee.id)} className="btn btn-danger">Restore</button>
                        </td>
                      </tr>
                    ))}


                            
                            
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
          )}
        

      </div>



      
    </div>




  );


  
}

export default Dashboard;
