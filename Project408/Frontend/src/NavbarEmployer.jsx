import { FaSearch, FaBell } from 'react-icons/fa';
import { FaClock, FaBriefcase, FaComments, FaBookOpen } from 'react-icons/fa';
import { Navbar, Nav, Container, FormControl, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useNotificationContext } from './NotificationContext.jsx';

function NavbarEmployer() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const { notifications, addNotification, markAsRead, clearAllNotifications } = useNotificationContext();
  const [showNotifications, setShowNotifications] = useState(false);

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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  function getIconForType(type) {
    switch (type) {
      case "interview":
        return <FaClock className="me-2 text-primary" />;
      case "offer":
        return <FaBriefcase className="me-2 text-success" />;
      case "chat":
        return <FaComments className="me-2 text-warning" />;
      case "blog":
        return <FaBookOpen className="me-2 text-info" />;
      default:
        return <FaBell className="me-2 text-secondary" />;
    }
  }


  return (
    <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-2 position-relative">
      <Container fluid className="d-flex justify-content-between align-items-center">

        {/* LOGO + TOGGLE */}
        <div className="d-flex align-items-center gap-3">
          <Navbar.Brand href="/employerDashboard" className="fw-bold text-primary">Logo</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        </div>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto d-flex gap-3 flex-column flex-lg-row mt-3 mt-lg-0">
            <Nav.Link href="/employer/profile" className="text-dark fw-medium">Profile</Nav.Link>
            <Nav.Link href="/employer/create-job" className="text-dark fw-medium">Post Job</Nav.Link>
            <Nav.Link href="/employer/applications" className="text-dark fw-medium">My Job Applications</Nav.Link>
            <Nav.Link href="/job-offers" className="text-dark fw-medium">Offers</Nav.Link>
            <Nav.Link href="/blog" className="text-dark fw-medium">Blog</Nav.Link>
            <Nav.Link href="/interviews" className="text-dark fw-medium">Interviews</Nav.Link>
          </Nav>
        </Navbar.Collapse>


        {/* Sağ kısım: Arama + Bildirim + Kullanıcı */}
        <div className="d-flex align-items-center gap-3 position-relative">

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

          {/* Test için Add Notification Butonu */}
          {/* Add Different Types of Notifications for Testing */}
          {/* <div className="d-flex gap-2"> */}
          {/* <Button size="sm" variant="primary" onClick={() => addNotification("Reminder: Your interview with Acme Inc. is starting soon!", "/interviews/123", "interview")}>
              Add Interview Notification
            </Button>
            <Button size="sm" variant="success" onClick={() => addNotification("You received a new job offer from TechCorp!", "/job-offers", "offer")}>
              Add Offer Notification
            </Button> */}
          {/* <Button size="sm" variant="warning" onClick={() => addNotification("New message from HR Department!", "/chat", "chat")}>
              Add Chat Notification
            </Button> */}
          {/* <Button size="sm" variant="info" onClick={() => addNotification("New blog post: How to ace your tech interview", "/blog", "blog")}>
              Add Blog Notification
            </Button> */}
          {/* </div> */}




          {/* Notification */}
          <div className="position-relative">
            <Button variant="light" className="rounded-circle p-2" onClick={toggleNotifications}>
              <FaBell className="text-dark" />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "blue",
                    borderRadius: "50%"
                  }}
                />
              )}
            </Button>

            {/* Bildirim Kutusu */}
            {showNotifications && (
              <div
                className="notification-scroll"
                style={{
                  position: "absolute",
                  right: "0",
                  marginTop: "10px",
                  width: "300px",
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  maxHeight: "300px",
                  overflowY: "auto"
                }}
              >


                {notifications.length === 0 ? (
                  <div style={{ padding: "10px" }}>No notifications.</div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        backgroundColor: notification.isRead ? "white" : "#f0f4ff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          navigate(notification.link);
                        }
                      }}

                    >
                      {getIconForType(notification.type)}
                      <span>{notification.title}</span>
                    </div>
                  ))
                )}

                {/* Clear All Butonu */}
                {notifications.length > 0 && (
                  <div style={{ padding: "10px", textAlign: "center" }}>
                    <button
                      onClick={clearAllNotifications}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        cursor: "pointer"
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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

export default NavbarEmployer;
