package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportedBlogDTO {
    private Integer id;
    private String title;
    private String authorEmail;
    private String reportReason;
    private String status;
} 