// src/Navbar.jsx
import { FaSearch, FaBell } from 'react-icons/fa';
import { Navbar, Nav, Container, FormControl, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";


function NavbarCustom() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('id');

    navigate('/login');
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    if (!token || !id) {
      console.log('User not logged in or ID is missing');
      return;
    }

    fetch(`http://localhost:9090/candidate/userName/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
        .then(res => res.json())
        .then(data => {
          if (data && data.userName) {
            setUserName(data.userName);
          } else {
            console.log('No username found in the response');
          }
        })
        .catch(err => console.error("Unable to fetch user info", err));
  }, []);



  return (
      <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-2">
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Sol kısım: Logo + Menü */}
          <div className="d-flex align-items-center gap-5">
            <Navbar.Brand href="/" className="fw-bold text-primary">Logo</Navbar.Brand>
            <Nav className="d-flex gap-4">
              <Nav.Link href="/employer/profile" className="text-dark fw-medium">Profile</Nav.Link>
              <Nav.Link href="/employer/create-job" className="text-dark fw-medium">Post Job</Nav.Link>
              <Nav.Link href="/employer/my-jobs" className="text-dark fw-medium">My Job Listings</Nav.Link>
              <Nav.Link href="/employer/applications" className="text-dark fw-medium">Candidates</Nav.Link>
              <Nav.Link href="/employer/offers" className="text-dark fw-medium">Offers</Nav.Link>
            </Nav>

          </div>

          {/* Sağ kısım: Arama + Bildirim + Kullanıcı */}
          <div className="d-flex align-items-center gap-3">
            {/* Search */}
            <div className="position-relative bg-light rounded-pill px-3 py-1 d-flex align-items-center">
              <FaSearch className="text-muted me-2" />
              <FormControl
                  type="search"
                  placeholder="Search"
                  className="border-0 bg-transparent shadow-none"
                  style={{ width: '160px' }}
              />
            </div>

            {/* Notification */}
            <Button variant="light" className="rounded-circle p-2">
              <FaBell className="text-dark" />
            </Button>

            {/* User */}
            <Dropdown align="end">
              <Dropdown.Toggle
                  style={{ backgroundColor: '#0C21C1', borderColor: '#0C21C1' }}
                  variant="primary" className="rounded-pill px-3 py-1 text-white fw-medium">
                {userName}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/profile/settings">Profile Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </div>
        </Container>
      </Navbar>
  );
}

export default NavbarCustom;
