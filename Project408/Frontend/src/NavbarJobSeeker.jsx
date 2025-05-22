import { FaSearch, FaBell } from 'react-icons/fa';
import { Navbar, Nav, Container, FormControl, Button, Dropdown } from 'react-bootstrap';
import { useUser } from './UserContext.jsx';
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function NavbarCustom() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  // const { user } = useUser();
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
          <Navbar.Brand href="/candidate/jobs" className="fw-bold text-primary">Logo</Navbar.Brand>
          <Nav className="d-flex gap-4">
            <Nav.Link href="/candidate/dashboard" className="text-dark fw-medium nav-item-hover">Profile</Nav.Link>
            <Nav.Link href="/candidate/my-jobs" className="text-dark fw-medium">My Applications</Nav.Link>
            <Nav.Link href="/employer/offers" className="text-dark fw-medium">My Offers</Nav.Link>
            {/*<Nav.Link href="/chat" className="text-dark fw-medium">Chat</Nav.Link>*/}
            <Nav.Link href="/blog" className="text-dark fw-medium">Blog</Nav.Link>
            <Nav.Link href="/interviews" className="text-dark fw-medium">Interviews</Nav.Link>
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