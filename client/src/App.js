import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import LandingPage from "./landing/LandingPage"
import SignUp from './landing/SignUp';
import AdminDashboard from './admin/AdminPage';
// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentPage from './student/StudentPage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/admindashboard' element={<AdminDashboard/>}/>
          <Route path='/studentdashboard' element={<StudentPage/>}/>
          
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
