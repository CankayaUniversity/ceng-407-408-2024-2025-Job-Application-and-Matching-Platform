// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './Layout';
import PrivateRoute from './PrivateRoute';
import SignUp from './SignUp';
import Login from './Login';
import JobSeekerDashboard from './JobSeekerDashboard';
import EmployerDashboard from "./EmployerDashboard";
import JobOffers from './components/JobOffers';
import EditJobForm from './components/EditJobForm';
import JobAdvList from "./JobAdvList";
import JobAdvDetail from "./JobAdvDetail";
import EmployerProfile from './components/EmployerProfile';
import CreateJobForm from './components/CreateJobForm';

function App() {
  return (
    
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes with navbar */}
        {/* <Route element={<PrivateRoute />}> */}
        <Route>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<JobSeekerDashboard />} />
            <Route path="/employerDashboard" element={<EmployerDashboard />} />
            <Route path="/job-offers" element={<JobOffers />} />
            <Route path="/jobs" element={<JobAdvList />} />
            <Route path="/jobs/:id" element={<JobAdvDetail />} />
            <Route path="/employer/jobs/:id/edit" element={<EditJobForm />} />
            <Route path="/employer/profile" element={<EmployerProfile />} />
            <Route path="/employer/create-job" element={<CreateJobForm />} />
          </Route>
        </Route>
      </Routes>
    
  );
}

export default App;
