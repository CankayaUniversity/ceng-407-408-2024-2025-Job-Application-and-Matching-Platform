package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class NotificationDTO {
    private Integer id;
    private String message;
    private String link;
    private boolean isRead;
    private LocalDateTime createdAt;
    private String userEmail; // Optional: To indicate who the notification is for, if needed in broader contexts

    public NotificationDTO(Integer id, String message, String link, boolean isRead, LocalDateTime createdAt, String userEmail) {
        this.id = id;
        this.message = message;
        this.link = link;
        this.isRead = isRead;
        this.createdAt = createdAt;
        this.userEmail = userEmail;
    }

}
