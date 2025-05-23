package Backend.services.impl;

import Backend.entities.common.Notification;
import Backend.entities.dto.NotificationDTO;
import Backend.entities.user.User;
import Backend.repository.NotificationRepository;
import Backend.repository.UserRepository;
import Backend.services.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository; // To fetch user if only ID is provided

    private NotificationDTO convertToDTO(Notification notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getMessage(),
                notification.getLink(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getUser().getEmail()
        );
    }

    @Override
    @Transactional
    public NotificationDTO createNotification(User user, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setLink(link);
        notification.setRead(false);
        // createdAt will be set by @PrePersist
        Notification savedNotification = notificationRepository.save(notification);
        return convertToDTO(savedNotification);
    }

    @Override
    public List<NotificationDTO> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationDTO> getUnreadNotificationsForUser(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NotificationDTO markAsRead(Integer notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getId().equals(user.getId())) {
            // Or throw an unauthorized exception
            throw new SecurityException("User not authorized to mark this notification as read.");
        }

        notification.setRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        return convertToDTO(updatedNotification);
    }

    @Override
    @Transactional
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadForUser(user);
    }

    @Override
    @Transactional
    public void notifyUser(User user, String message, String link) {
        // This method is a convenience wrapper for createNotification
        // It can be expanded later if specific logic is needed for "notifying"
        // versus just "creating" a notification entry.
        createNotification(user, message, link);
    }
} 