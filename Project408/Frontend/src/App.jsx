// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { PostProvider, usePostContext } from './PostContext.jsx';
import { UserProvider } from './UserContext.jsx';
import { NotificationProvider } from "./NotificationContext.jsx";
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
import Chat from './Chat';
import Blog from './Blog';
import PostDetail from './PostDetail';
import InterviewPage from './InterviewPage.jsx';
import NotificationsPage from './NotificationsPage.jsx';
import JobOffersEmployer from "./components/JobOffersEmployer.jsx";
import JobListings from "./components/JobListings.jsx";
import ApplicationsPage from "./components/ApplicationsPage.jsx";
import CandidateList from "./components/CandidateList.jsx";
import JobSeekerMyJobs from "./components/JobSeekerMyJobs.jsx";
import EmailVerification from './EmailVerification.jsx';
import ForgotPassword from "./ForgotPassword.jsx";
import ProfileSettings from './ProfileSettings';
import ReportedOffers from './ReportedBlogs.jsx';
import ReportedJobs from './ReportedJobs.jsx';
import ReportedUsers from './ReportedUsers.jsx';
import AdminReportMetrics from './AdminReportMetrics.jsx';
import RecommendedJobs from "./components/RecommendedJobs.jsx";
import RecommendedCandidates from "./components/RecommendedCandidates.jsx";


function App() {

  const [notifications, setNotifications] = useState([]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  return (
    <NotificationProvider>
      <UserProvider>
        <PostProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verification" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/candidate/dashboard" element={<JobSeekerDashboard />} />
                {/*<Route path="/employerDashboard" element={<EmployerDashboard />} />*/}
                <Route path="/job-offers" element={<JobOffersEmployer />} />
                <Route path="/candidate/jobs" element={<JobAdvList />} />
                <Route path="/employer/jobs/:id/edit" element={<EditJobForm />} />
                <Route path="/employer/create-job" element={<CreateJobForm />} />
                <Route path="/employer/profile" element={<EmployerProfile />} />
                <Route path="/employer/my-jobs" element={<JobListings />} />
                <Route path="/candidate/offers" element={<JobOffers />} />
                <Route path="/candidate/my-jobs" element={<JobSeekerMyJobs />} />
                <Route path="/employer/applications" element={<ApplicationsPage />} />
                <Route path="/employer/applications/candidates" element={<CandidateList />} />
                <Route path="/profile/settings" element={<ProfileSettings />} />
                <Route path="/admin/reported-blogs" element={<ReportedOffers />} />
                <Route path="/admin/reported-jobs" element={<ReportedJobs />} />
                <Route path="/admin/reported-users" element={<ReportedUsers />} />
                <Route path="/admin/metrics" element={<AdminReportMetrics />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/interviews" element={<InterviewPage />} />
                <Route path="/notifications" element={<NotificationsPage notifications={notifications} markAsRead={markAsRead} />} />
                <Route path="/candidate/recommendedJobs" element={<RecommendedJobs />} />
                <Route path="/employer/recommendedCandidates" element={<RecommendedCandidates />} />
                <Route path="/candidate/recommendedJobs" element={<RecommendedJobs />} />

              </Route>
            </Route>
          </Routes>

        </PostProvider>
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;