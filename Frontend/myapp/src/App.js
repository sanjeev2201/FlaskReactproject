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
function App() {
  return (
    
      <div>
        <Router>
        {/* <Header /> */}
        <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Signup" element={<Signup/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/Logout" element={<Logout/>} />
          <Route path="/Resetpassword" element={<Resetpassword/>} />
          <Route path="/UpdateUser/:id" element={<UpdateUser />} />
        </Routes>
        </main>
        </Router>
      </div>
    );
  
}

export default App;
