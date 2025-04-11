import { Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import JobSeekerDashboard from './JobSeekerDashboard';
<<<<<<< HEAD
import EmployerDashboard from "./EmployerDashboard.jsx";
import JobOffers from './components/JobOffers';
import EditJobForm from './components/EditJobForm';
=======
import EmployerDashboard from "./EmployerDashboard";
import JobAdvList from "./JobAdvList";
import JobAdvDetail from "./JobAdvDetail";

>>>>>>> features2-login

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<JobSeekerDashboard />} />
<<<<<<< HEAD
      <Route path="/employerDashboard" element={<EmployerDashboard />} />
      <Route path="/employer/jobs/:id/edit" element={<EditJobForm />} />
      <Route path="/job-offers" element={<JobOffers />} />
=======
        <Route path="/employerDashboard" element={<EmployerDashboard />} />
        <Route path="/jobs" element={<JobAdvList />} />
        <Route path="/jobs/:id" element={<JobAdvDetail />} />
>>>>>>> features2-login
      {/* <div className="bg-red-500 text-white p-4">
        Eğer bu kırmızı kutu görünüyorsa Tailwind çalışıyor 🎉
      </div> */}

    </Routes>
  );
}

export default App;