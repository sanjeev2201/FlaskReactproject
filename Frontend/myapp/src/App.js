import './App.css'
// import './Register.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Component/signup';
import Dashboard from './Component/Dashboard';
import Login from './Component/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from './Component/Logout';
import Resetpassword from './Component/Resetpwd';
import UpdateUser from './Component/UpdateUser';
import PrivateLayout from './layouts/PrivateLayout';
import Organization from './Component/Organization';
import Roles  from './Component/Roles'; 
import Profile from './Component/Profile';
function App() {
  return (
    
      <div>
        <Router>
        <main>
        <Routes>
          
          <Route path="/Signup" element={<Signup/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/Logout" element={<Logout/>} />
          <Route path="/Resetpassword" element={<Resetpassword/>} />
          <Route path="/UpdateUser/:id" element={<UpdateUser />} />
            <Route element={<PrivateLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/organization" element={<Organization/>} />
              <Route path="/Role" element={<Roles />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
        </Routes>
        </main>
        </Router>
      </div>
    );
  
}

export default App;
