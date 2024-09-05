import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import LandingPage from "./landing/LandingPage"
import SignUp from './landing/SignUp';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/signup' element={<SignUp/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
