package Backend.entities.jobAdv;

import Backend.core.enums.EmploymentType;
import Backend.core.enums.WorkType;
import Backend.entities.BaseEntity;
import Backend.core.location.Country;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity

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
    @JsonBackReference ("jobadv")// Prevents circular references during serialization
    private JobAdv jobAdv;

    public WorkType getWorkType() {
        return workType;
    }

    public void setWorkType(WorkType workType) {
        this.workType = workType;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public int getMinWorkHours() {
        return minWorkHours;
    }

    public void setMinWorkHours(int minWorkHours) {
        this.minWorkHours = minWorkHours;
    }

    public int getMaxWorkHours() {
        return maxWorkHours;
    }

    public void setMaxWorkHours(int maxWorkHours) {
        this.maxWorkHours = maxWorkHours;
    }

    public JobAdv getJobAdv() {
        return jobAdv;
    }

    public void setJobAdv(JobAdv jobAdv) {
        this.jobAdv = jobAdv;
    }
}
