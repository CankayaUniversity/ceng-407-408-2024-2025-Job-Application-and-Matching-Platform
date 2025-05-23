package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportedJobDTO {
    private Integer id;
    private String title;
    private String companyName;
    private String reportedByEmail;
    private String reportReason;
    private String status;
} 