import React, { useEffect, useState } from "react";
import { FaSearch, FaBell, FaUserCircle, FaSignOutAlt, FaFileAlt, FaBriefcase, FaCalendarCheck, FaComments, FaBlog } from 'react-icons/fa';
import { Navbar, Nav, Container, FormControl, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from "./NotificationContext";
import axios from "axios";

const NavbarJobSeeker = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Job Seeker');
    const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotificationContext();
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');

        if (token && id) {
            axios.get(`http://localhost:9090/candidate/userName/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                setUserName(response.data.userName || 'Job Seeker');
            })
            .catch(error => {
                console.error("Failed to fetch user name:", error);
            });
            // fetchNotifications(); // Context handles initial fetch
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
        <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-3 fixed-top">
            <Container fluid>
                <Navbar.Brand href="/JobSeekerDashboard" className="fw-bold text-success">Logo</Navbar.Brand>
                <Navbar.Toggle aria-controls="jobseeker-navbar-nav" />
                <Navbar.Collapse id="jobseeker-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/JobSeekerDashboard" className="fw-medium">
                            <FaBriefcase className="me-2" />Dashboard
                        </Nav.Link>
                        <Nav.Link href="/my-applications" className="fw-medium">
                            <FaFileAlt className="me-2" />My Applications
                        </Nav.Link>
                         <Nav.Link href="/job-offers" className="fw-medium">
                            <FaBriefcase className="me-2" />Offers
                        </Nav.Link>
                        <Nav.Link href="/interviews" className="fw-medium">
                            <FaCalendarCheck className="me-2" />Interviews
                        </Nav.Link>
                        <Nav.Link href="/chat" className="fw-medium">
                            <FaComments className="me-2" />Chat
                        </Nav.Link>
                        <Nav.Link href="/blog" className="fw-medium">
                            <FaBlog className="me-2" />Blog
                        </Nav.Link>
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
                        <NavDropdown title={<><FaUserCircle className="me-1" /> {userName}</>} id="jobseeker-profile-dropdown" align="end">
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

export default NavbarJobSeeker;