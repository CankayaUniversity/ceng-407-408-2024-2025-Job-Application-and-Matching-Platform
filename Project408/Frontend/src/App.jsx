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
import CreateJobForm from './components/CreateJobForm';
import JobListings from "./components/JobListings.jsx";
import JobSeekerMyJobs from "./components/JobSeekerMyJobs.jsx";
import ApplicationsPage from "./components/ApplicationsPage.jsx";
import CandidateList from "./components/CandidateList.jsx";
import EmployerProfile from "./components/EmployerProfile.jsx";
import JobOffersEmployer from "./components/JobOffersEmployer.jsx";
import Chat from './Chat';
import Blog from './Blog';
import PostDetail from './PostDetail';

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

              <Route path="/candidate/dashboard" element={<JobSeekerDashboard/>}/>
              <Route path="/employerDashboard" element={<EmployerDashboard/>}/>
              <Route path="/job-offers" element={<JobOffersEmployer/>}/>
              <Route path="/candidate/jobs" element={<JobAdvList/>}/>
              <Route path="/employer/jobs/:id/edit" element={<EditJobForm/>}/>
              <Route path="/employer/create-job" element={<CreateJobForm/>}/>
              <Route path="/employer/profile" element={<EmployerProfile/>}/>
              <Route path="/employer/my-jobs" element={<JobListings/>}/>
              <Route path="/employer/offers" element={<JobOffers/>}/>
              <Route path="/candidate/my-jobs" element={<JobSeekerMyJobs/>}/>
              <Route path="/employer/applications" element={<ApplicationsPage/>}/>
              <Route path="/candidates" element={<CandidateList />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/post/:id" element={<PostDetail />} />
          </Route>
        </Route>
      </Routes>
    
  );
}

export default App;
