package Backend.request.jobAdv;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobAdvUpdateRequest {

    private String description;
    private Double minSalary;
    private Double maxSalary;
    private LocalDate deadline;
    private boolean travelRest;
    private boolean license;
}
