import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button, Dropdown } from 'react-bootstrap';
import { FaBell, FaUserCircle, FaSignOutAlt, FaBuilding, FaPlusCircle, FaListAlt, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from "./NotificationContext";
import axios from "axios";

const NavbarEmployer = () => {
    const navigate = useNavigate();
    const [employerName, setEmployerName] = useState('');
    const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotificationContext();
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');

        if (token && id) {
            axios.get(`http://localhost:9090/employer/profileDetails/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setEmployerName(response.data.employerName || 'Employer');
            })
            .catch(error => {
                console.error("Failed to fetch employer details:", error);
                setEmployerName('Employer'); 
            });
            // fetchNotifications(); // Context now handles initial fetch
        } else {
            navigate('/login');
        }
    }, [navigate, fetchNotifications]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('id');
        navigate('/login');
    };

    const toggleNotifications = () => setShowNotifications(!showNotifications);

    const handleMarkNotificationAsRead = (notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
        }
        // setShowNotifications(false);
    };

    const handleClearAll = async () => {
        await markAllAsRead();
    };

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm px-4 py-3">
            <Container fluid>
                <Navbar.Brand href="/employer/dashboard" className="fw-bold text-primary">Logo</Navbar.Brand>
                <Navbar.Toggle aria-controls="employer-navbar-nav" />
                <Navbar.Collapse id="employer-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/employer/dashboard" className="fw-medium">
                            <FaBuilding className="me-2" />Dashboard
                        </Nav.Link>
                        <Nav.Link href="/employer/create-job-adv" className="fw-medium">
                            <FaPlusCircle className="me-2" />Create Job Adv
                        </Nav.Link>
                        <Nav.Link href="/employer/job-advs" className="fw-medium">
                            <FaListAlt className="me-2" />My Job Advs
                        </Nav.Link>
                        <Nav.Link href="/chat" className="fw-medium">
                            <FaComments className="me-2" />Chat
                        </Nav.Link>
                        {/* Add other employer-specific links here */}
                    </Nav>
                    <Nav className="ms-auto d-flex align-items-center">
                        <div className="position-relative me-3">
                            <Button variant="light" className="rounded-circle p-2" onClick={toggleNotifications}>
                                <FaBell />
                                {unreadCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                        <span className="visually-hidden">New alerts</span>
                                    </span>
                                )}
                            </Button>
                            {showNotifications && (
                                <div className="dropdown-menu dropdown-menu-end show position-absolute mt-2 shadow-lg" style={{ width: '320px', right: 0, left: 'auto' }}>
                                    <div className="p-2 border-bottom">
                                        <h6 className="mb-0">Notifications</h6>
                                    </div>
                                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <div className="p-3 text-center text-muted">No new notifications.</div>
                                        ) : (
                                            notifications.map(notification => (
                                                <Dropdown.Item key={notification.id} onClick={() => handleMarkNotificationAsRead(notification)} className={`d-flex align-items-start p-2 ${!notification.isRead ? 'bg-light' : ''}`}>
                                                    <FaBell className="text-info me-2 mt-1 flex-shrink-0" />
                                                    <div className="flex-grow-1">
                                                        <small className="fw-bold">{notification.message || notification.title}</small>
                                                        <div className="text-muted x-small">
                                                            {new Date(notification.createdAt).toLocaleTimeString()} - {new Date(notification.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </Dropdown.Item>
                                            ))
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="p-2 border-top text-center">
                                            <Button variant="link" size="sm" onClick={handleClearAll} className="text-danger">
                                                Mark all as read
                                            </Button>
                                        </div>
                                    )}
                                </div> 
                            )}
                        </div>
                        <NavDropdown title={<><FaUserCircle className="me-1" /> {employerName}</>} id="employer-profile-dropdown" align="end">
                            <NavDropdown.Item href="/profile-settings">
                                <FaUserCircle className="me-2" />Profile Settings
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>
                                <FaSignOutAlt className="me-2" />Sign Out
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarEmployer;
