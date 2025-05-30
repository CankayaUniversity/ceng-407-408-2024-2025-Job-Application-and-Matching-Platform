import { FaBell, FaGavel, FaUsers, FaBriefcase } from 'react-icons/fa';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useNotificationContext } from './NotificationContext.jsx';

function NavbarAdmin() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotificationContext();
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('id');
        navigate('/login');
    };

    useEffect(() => {
        // Fetch username logic (currently mocked)
        setUserName("Admin"); 
        // Fetch initial notifications if not already handled by context
        // fetchNotifications(); // Context now handles initial fetch
    }, [fetchNotifications]);

    const toggleNotifications = () => setShowNotifications(!showNotifications);
    // const unreadCount = notifications.filter(n => !n.isRead).length; // Now from context

    const handleMarkNotificationAsRead = (notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
        }
        // Optionally, close dropdown after click
        // setShowNotifications(false);
    };

    const handleClearAll = async () => {
        await markAllAsRead();
        // Notifications will re-render as read due to context update
    };

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-2 position-relative">
            <Container fluid className="d-flex justify-content-between align-items-center">

                {/* Logo + Menu */}
                <div className="d-flex align-items-center gap-3">
                    <Navbar.Brand href="/admin/dashboard" className="fw-bold text-danger">Hirely</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                </div>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="d-flex gap-4">
                        <Nav.Link href="/admin/reported-blogs" className="text-dark fw-medium">
                            <FaBriefcase className="me-2" />Blogs
                        </Nav.Link>
                        <Nav.Link href="/admin/reported-jobs" className="text-dark fw-medium">
                            <FaGavel className="me-2" />Reported Jobs
                        </Nav.Link>
                        <Nav.Link href="/admin/reported-users" className="text-dark fw-medium">
                            <FaUsers className="me-2" />Reported Users
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>


                {/* Right Area */}
                <div className="d-flex align-items-center gap-3 position-relative">

                    {/* Notifications */}
                    <div className="position-relative">
                        <Button variant="light" className="rounded-circle p-2" onClick={toggleNotifications}>
                            <FaBell className="text-dark" />
                            {unreadCount > 0 && (
                                <span className="position-absolute top-0 end-0 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                            )}
                        </Button>

                        {showNotifications && (
                            <div
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
                                            onClick={() => handleMarkNotificationAsRead(notification)}
                                            style={{
                                                padding: "10px",
                                                borderBottom: "1px solid #eee",
                                                backgroundColor: notification.isRead ? "white" : "#f0f4ff",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px"
                                            }}
                                        >
                                            <FaBell className="text-secondary" />
                                            {/* Assuming notification object has a 'message' field from backend DTO */}
                                            <span>{notification.message || notification.title}</span>
                                        </div>
                                    ))
                                )}
                                {notifications.length > 0 && (
                                    <div className="text-center py-2 border-top">
                                        <Button size="sm" variant="link" onClick={handleClearAll} className="text-danger">
                                            Mark all as read
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Dropdown */}
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            style={{ backgroundColor: '#b30000', borderColor: '#b30000' }}
                            variant="danger" className="rounded-pill px-3 py-1 text-white fw-medium">
                            {userName || 'Admin'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
}

export default NavbarAdmin;
