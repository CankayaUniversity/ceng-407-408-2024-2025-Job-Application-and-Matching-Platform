// src/routes/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ADMIN_EMAIL = "jobapp408@gmail.com";

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  const location = useLocation();
  const path = location.pathname;

  if (!token) {
    return <Navigate to="/login" />;
  }

  const payload = parseJwt(token);
  const userEmail = payload?.sub;

  // Admin sayfaları kontrolü
  if (path.startsWith('/admin')) {
    if (userEmail !== ADMIN_EMAIL) {
      return <Navigate to="/login" />;
    }
  }

  // Candidate sayfaları kontrolü
  if (path.startsWith('/candidate') ) {
    if (userType !== 'CANDIDATE') {
      return <Navigate to="/login" />;
    }
  }

  // Employer sayfaları kontrolü
  if (path.startsWith('/employer') || path === '/employerDashboard' || path === '/job-offers') {
    if (userType !== 'EMPLOYER') {
      return <Navigate to="/login" />;
    }
  }

  return <Outlet />;
};

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default PrivateRoute;
