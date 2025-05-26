import React from 'react';
import { useNotificationContext } from './NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

function NotificationsPage() {
  const { notifications, markAsRead, fetchNotifications } = useNotificationContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link && notification.link !== '#') {
      navigate(notification.link);
    }
  };

  return (
    <div className="container mt-5 pt-4" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Notifications</h1>
        <button className="btn btn-sm btn-outline-secondary" onClick={fetchNotifications}>Refresh</button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center p-5">
          <FaBell size={48} className="text-muted mb-3" />
          <p className="lead text-muted">You have no notifications.</p>
        </div>
      ) : (
        <ul className="list-group shadow-sm">
          {notifications.map(notification => (
            <li
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-start ${!notification.isRead ? 'list-group-item-light fw-bold' : ''}`}
              style={{ cursor: "pointer" }}
            >
              <div className="ms-2 me-auto">
                <div className="fw-normal">{notification.message || notification.title}</div>
                <small className="text-muted">
                  {new Date(notification.createdAt).toLocaleDateString()} - {new Date(notification.createdAt).toLocaleTimeString()}
                </small>
              </div>
              {!notification.isRead && (
                <span className="badge bg-primary rounded-pill mt-1">New</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsPage;
