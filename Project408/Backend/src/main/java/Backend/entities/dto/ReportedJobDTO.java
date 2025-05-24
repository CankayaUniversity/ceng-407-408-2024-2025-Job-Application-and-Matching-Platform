package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReportedJobDTO {
    private Integer id;
    private String title;
    private String companyName;
    private String reportedByEmail;
    private String reportReason;
    private String status;

    public ReportedJobDTO(Integer id, String title, String companyName, String reportedByEmail,String reportReason, String status) {
        this.id = id;
        this.title = title;
        this.companyName = companyName;
        this.reportedByEmail = reportedByEmail;
        this.reportReason = reportReason;
        this.status = status;
    }

} 