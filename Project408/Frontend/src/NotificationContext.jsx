import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios"; // Assuming axios is used for API calls

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // Fetch all notifications initially, or unread ones based on preference
            const response = await axios.get("http://localhost:9090/notifications", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            // Potentially set an error state or show a toast
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Consider adding a polling mechanism or WebSocket for real-time updates
        // const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
        // return () => clearInterval(interval);
    }, [fetchNotifications]);

    const addNotification = (title, link = "#", type = "default") => {
        // This is a local add, backend should ideally push or be polled
        const newNotification = { id: Date.now(), title, link, isRead: false, type, createdAt: new Date().toISOString() };
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
    };

    const markAsRead = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await axios.post(`http://localhost:9090/notifications/${id}/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id ? { ...notification, isRead: true } : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1)); // Ensure count doesn't go below 0
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            await axios.post("http://localhost:9090/notifications/read-all", {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, isRead: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    // clearAllNotifications is effectively markAllAsRead on the backend now if we want to keep them but just mark as read.
    // If actual deletion is needed, a separate backend endpoint would be required.
    // For now, let's rename it for clarity or decide if we want to keep local-only clear.
    const clearAndMarkAllAsRead = async () => {
        await markAllAsRead(); 
        // If you still want to clear them from the local UI after marking read on backend:
        // setNotifications([]); 
        // setUnreadCount(0);
    }


    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, fetchNotifications, clearAndMarkAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    return useContext(NotificationContext);
}
