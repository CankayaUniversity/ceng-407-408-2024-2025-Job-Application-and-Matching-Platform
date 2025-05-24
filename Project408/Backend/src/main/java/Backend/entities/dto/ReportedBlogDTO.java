package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data

@NoArgsConstructor
public class ReportedBlogDTO {
    private Integer id;
    private String title;
    private String authorEmail;
    private String reportReason;
    private String status;

    public ReportedBlogDTO(Integer id, String title, String authorEmail, String reportReason, String status) {
        this.id = id;
        this.title = title;
        this.authorEmail = authorEmail;
        this.reportReason = reportReason;
        this.status = status;
    }
} 