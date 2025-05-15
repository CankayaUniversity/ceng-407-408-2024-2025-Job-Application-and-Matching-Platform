import React from 'react';
import { useNotificationContext } from './NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';

function NotificationsPage() {
  const { notifications, markAsRead } = useNotificationContext();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}>
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map(notification => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            style={{
              padding: "15px",
              borderBottom: "1px solid #eee",
              backgroundColor: notification.isRead ? "white" : "#f0f4ff",
              cursor: "pointer"
            }}
          >
            {notification.title}
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationsPage;
