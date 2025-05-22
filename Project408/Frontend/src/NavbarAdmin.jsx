import { FaBell, FaGavel, FaUsers, FaBriefcase } from 'react-icons/fa';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useNotificationContext } from './NotificationContext.jsx';

function NavbarAdmin() {
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

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     const id = localStorage.getItem('id');

    //     if (!token || !id) return;

    //     fetch(`http://localhost:9090/admin/userName/${id}`, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(res => {
    //             if (!res.ok) throw new Error('Unauthorized or no access');
    //             return res.json();
    //         })
    //         .then(data => {
    //             if (data?.userName) setUserName(data.userName);
    //         })
    //         .catch(err => {
    //             console.error('Failed to fetch admin user info:', err.message);
    //         });

    // }, []);

    useEffect(() => {
        setUserName("Admin");
    }, []);

    const toggleNotifications = () => setShowNotifications(!showNotifications);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-2 position-relative">
            <Container fluid className="d-flex justify-content-between align-items-center">

                {/* Logo + Menu */}
                <div className="d-flex align-items-center gap-5">
                    <Navbar.Brand href="/admin/dashboard" className="fw-bold text-danger">Logo</Navbar.Brand>
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
                </div>

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
                                            onClick={() => {
                                                markAsRead(notification.id);
                                                if (notification.link) navigate(notification.link);
                                            }}
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
                                            <span>{notification.title}</span>
                                        </div>
                                    ))
                                )}
                                <div className="text-center py-2">
                                    <Button size="sm" variant="danger" onClick={clearAllNotifications}>
                                        Clear All
                                    </Button>
                                </div>
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
