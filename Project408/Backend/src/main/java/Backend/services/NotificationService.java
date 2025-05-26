package Backend.services;

import Backend.entities.dto.NotificationDTO;
import Backend.entities.user.User;

import java.util.List;

public interface NotificationService {

    NotificationDTO createNotification(User user, String message, String link);

    List<NotificationDTO> getNotificationsForUser(User user);

    List<NotificationDTO> getUnreadNotificationsForUser(User user);

    NotificationDTO markAsRead(Integer notificationId, User user);

    void markAllAsRead(User user);

    // Method to be called by other services to create notifications
    void notifyUser(User user, String message, String link);
} 