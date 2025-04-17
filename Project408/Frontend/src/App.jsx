import { Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import JobSeekerDashboard from './JobSeekerDashboard';
import EmployerDashboard from "./EmployerDashboard";
import JobAdvList from "./JobAdvList";


function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<JobSeekerDashboard />} />
        <Route path="/employerDashboard" element={<EmployerDashboard />} />
        <Route path="/jobs" element={<JobAdvList />} />
      {/* <div className="bg-red-500 text-white p-4">
        Eğer bu kırmızı kutu görünüyorsa Tailwind çalışıyor 🎉
      </div> */}

    </Routes>
  );
}

export default App;