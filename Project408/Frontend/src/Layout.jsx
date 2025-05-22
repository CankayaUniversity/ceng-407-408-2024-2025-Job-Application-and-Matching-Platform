import { Outlet } from 'react-router-dom';
import NavbarJobSeeker from './NavbarJobSeeker';
import NavbarEmployer from './NavbarEmployer';
import NavbarAdmin from './NavbarAdmin';

export default function Layout() {
  const userType = localStorage.getItem('userType');
  const userEmail = localStorage.getItem('userEmail');

  return (
    <>
      {userEmail === "jobapp408@gmail.com" ? (
        <NavbarAdmin />
      ) : userType === "CANDIDATE" ? (
        <NavbarJobSeeker />
      ) : (
        <NavbarEmployer />
      )}
      <Outlet />
    </>
  );
}
