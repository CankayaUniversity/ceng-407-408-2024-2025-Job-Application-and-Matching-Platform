package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Integer id;
    private String message;
    private String link;
    private boolean isRead;
    private LocalDateTime createdAt;
    private String userEmail; // Optional: To indicate who the notification is for, if needed in broader contexts
} 