import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from "./landing/LandingPage";
import SignUp from './landing/SignUp';
import AdminDashboard from './admin/AdminPage';
import Report from './admin/Report';
import StudentPage from './student/StudentPage';
import Instructions from './student/Instructions';
import { Provider } from 'react-redux';
import store from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedAdminRoute from './ProtectedRoutes/ProtectedRouteAdmin';  // Import Admin Protected Route
import ProtectedUserRoute from './ProtectedRoutes/ProtectedRoute';    // Import User Protected Route

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/signup' element={<SignUp />} />

            {/* Protecting routes for users */}
            <Route path='/studentdashboard/:loggedInUserId' element={<ProtectedUserRoute element={<StudentPage />} />} />
            <Route path='/instructions' element={<ProtectedUserRoute element={<Instructions />} />} />

            {/* Protecting routes for admins */}
            <Route path='/admindashboard' element={<ProtectedAdminRoute element={<AdminDashboard />} />} />
            <Route path='/report' element={<ProtectedAdminRoute element={<Report />} />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
