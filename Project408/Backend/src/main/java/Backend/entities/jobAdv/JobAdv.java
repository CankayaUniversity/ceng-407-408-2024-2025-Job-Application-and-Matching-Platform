package Backend.entities.jobAdv;

import Backend.entities.BaseEntity;
import Backend.entities.common.JobPositions;
import Backend.entities.company.Company;
import Backend.entities.user.employer.Employer;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_advs")
public class JobAdv extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "created_employer_id")
    private Employer createdEmployer;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "min_salary")
    private Double minSalary;

    @Column(name = "max_salary")
    private Double maxSalary;

    @Column(name = "last_date")
    private LocalDate lastDate;

    @Column(name = "travel_rest")
    private boolean travelRest;

    @Column(name = "license")
    private boolean license;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "job_condition_id")
    private JobCondition jobCondition;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "job_qualification_id")
    private JobQualification jobQualification;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "benefit_id")
    private List<Benefit> benefits;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "job_position_id")
    private List<JobPositions> jobPositions;
}
    
