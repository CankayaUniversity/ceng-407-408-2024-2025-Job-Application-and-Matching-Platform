package Backend.controller;

import Backend.entities.dto.NotificationDTO;
import Backend.entities.user.User;
import Backend.services.NotificationService;
import Backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*") // Adjust according to your CORS policy
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService; // To get the current user

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        return userService.getUserByEmail(currentPrincipalName);
    }

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getMyNotifications() {
        User currentUser = getCurrentUser();
        List<NotificationDTO> notifications = notificationService.getNotificationsForUser(currentUser);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getMyUnreadNotifications() {
        User currentUser = getCurrentUser();
        List<NotificationDTO> notifications = notificationService.getUnreadNotificationsForUser(currentUser);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markNotificationAsRead(@PathVariable Integer id) {
        User currentUser = getCurrentUser();
        NotificationDTO notification = notificationService.markAsRead(id, currentUser);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllNotificationsAsRead() {
        User currentUser = getCurrentUser();
        notificationService.markAllAsRead(currentUser);
        return ResponseEntity.ok().build();
    }
} 