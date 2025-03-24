package Backend.entities.user.candidate;

import Backend.core.enums.WorkType;
import Backend.entities.BaseEntity;
import Backend.entities.common.JobPositions;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_preferences")
public class JobPreferences extends BaseEntity {

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "job_position_id")
    private List<JobPositions> preferredPositions;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_work_type", nullable = false)
    private WorkType preferredWorkType;

    @Column(name = "min_work_hour")
    private int minWorkHour;

    @Column(name = "max_work_hour")
    private int maxWorkHour;

    @Column(name = "can_travel")
    private boolean canTravel;

    @Column(name = "expected_salary")
    private String expectedSalary;
}
