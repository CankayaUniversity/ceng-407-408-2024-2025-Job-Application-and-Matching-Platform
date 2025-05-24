package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReportedUserDTO {
    private Integer id;
    private String name;
    private String email;
    private String reportReason;
    private String status;

    public ReportedUserDTO(Integer id, String name, String email, String reportReason, String status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.reportReason = reportReason;
        this.status = status;
    }

}