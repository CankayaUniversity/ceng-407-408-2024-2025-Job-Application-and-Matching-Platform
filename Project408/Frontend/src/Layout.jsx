import { Outlet } from 'react-router-dom';
import NavbarJobSeeker from './NavbarJobSeeker';
import NavbarEmployer from './NavbarEmployer';

export default function Layout() {
  const userType = localStorage.getItem('userType'); // örneğin: 'employer' ya da 'jobseeker'

  return (
    <>
      {userType === 'employer' ? <NavbarJobSeeker /> : <NavbarEmployer />}  {/* Navbar'ı kullanıcı tipine göre göster, şimdilik backend olmadığı için default JobSeeker olan geliyor*/}
      <Outlet />
    </>
  );
}


// // src/layout/Layout.jsx
// import Navbar from './NavbarJobSeeker';
// import { Outlet } from 'react-router-dom';

// export default function Layout() {
//   return (
//     <>
//       <Navbar />
//       <div className="p-4">
//         <Outlet />
//       </div>
//     </>
//   );
// }

