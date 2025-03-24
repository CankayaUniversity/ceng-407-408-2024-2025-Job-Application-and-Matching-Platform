package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "references")
public class Reference extends BaseEntity {

    @Column(name = "reference_name", nullable = false)
    private String referenceName;

    @Column(name = "reference_job_title")
    private String referenceJobTitle;

    @Column(name = "reference_company")
    private String referenceCompany;

    @Column(name = "reference_contact_info")
    private String referenceContactInfo;

    @Column(name = "reference_years_worked")
    private String referenceYearsWorked;

}
