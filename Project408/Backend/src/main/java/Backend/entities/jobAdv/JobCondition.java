package Backend.entities.jobAdv;

import Backend.core.enums.EmploymentType;
import Backend.core.enums.WorkType;
import Backend.entities.BaseEntity;
import Backend.core.location.Country;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_conditions")
public class JobCondition extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "work_type", nullable = false)
    private WorkType workType;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", nullable = false)
    private EmploymentType employmentType;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @Column(name = "min_work_hours")
    private int minWorkHours;

    @Column(name = "max_work_hours")
    private int maxWorkHours;

    @OneToOne(mappedBy = "jobCondition")
    private JobAdv jobAdv;
}
