import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import LandingPage from "./landing/LandingPage"
import SignUp from './landing/SignUp';
import AdminDashboard from './admin/AdminPage';
import Report from './admin/Report';
// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentPage from './student/StudentPage';
import Instructions from './student/Instructions';
import { Provider } from 'react-redux';
import store from './store/store';



function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage />} />

            <Route path='/signup' element={<SignUp />} />
            <Route path='/report' element={<Report />} />
            <Route path='/admindashboard' element={<AdminDashboard />} />
            <Route path='/studentdashboard' element={<StudentPage />} />
            <Route path='/instructions' element={<Instructions />} />
          </Routes>
        </BrowserRouter>
      </Provider>

    </div>
  );
}

export default App;
