package Backend.entities.user.candidate;

import Backend.core.enums.WorkType;
import Backend.entities.BaseEntity;
import Backend.entities.common.JobPositions;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_preferences")
public class JobPreferences extends BaseEntity {

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
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


    public List<JobPositions> getPreferredPositions() {
        return preferredPositions;
    }

    public void setPreferredPositions(List<JobPositions> preferredPositions) {
        this.preferredPositions = preferredPositions;
    }

    public WorkType getPreferredWorkType() {
        return preferredWorkType;
    }

    public void setPreferredWorkType(WorkType preferredWorkType) {
        this.preferredWorkType = preferredWorkType;
    }

    public int getMinWorkHour() {
        return minWorkHour;
    }

    public void setMinWorkHour(int minWorkHour) {
        this.minWorkHour = minWorkHour;
    }

    public int getMaxWorkHour() {
        return maxWorkHour;
    }

    public void setMaxWorkHour(int maxWorkHour) {
        this.maxWorkHour = maxWorkHour;
    }

    public boolean isCanTravel() {
        return canTravel;
    }

    public void setCanTravel(boolean canTravel) {
        this.canTravel = canTravel;
    }

    public String getExpectedSalary() {
        return expectedSalary;
    }

    public void setExpectedSalary(String expectedSalary) {
        this.expectedSalary = expectedSalary;
    }
}
