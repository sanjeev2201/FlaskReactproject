import './App.css'
// import './Register.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Header from './Header';
import Payment from './components/Payment';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from './pages/Logout';
import FileUpload from './pages/FileUpload';
import Resetpassword from './pages/Resetpwd';

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
          <Route path="/Payment" element={<Payment/>} />
          <Route path="/Logout" element={<Logout/>} />
          <Route path="/FileUpload" element={<FileUpload/>} />
          <Route path="/Resetpassword" element={<Resetpassword/>} />
        </Routes>
        </main>
        </Router>
      </div>
    );
  
}

export default App;
