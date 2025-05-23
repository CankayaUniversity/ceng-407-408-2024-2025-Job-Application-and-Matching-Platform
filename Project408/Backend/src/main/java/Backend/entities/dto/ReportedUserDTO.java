package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportedUserDTO {
    private Integer id;
    private String name;
    private String email;
    private String reportReason;
    private String status;
} 