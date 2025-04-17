package Backend.entities.company;

import Backend.entities.BaseEntity;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.common.Project;
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
@Table(name = "companies")
public class Company extends BaseEntity {

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(name = "vision", length = 1000)
    private String vision;

    @Column(name = "mission", length = 1000)
    private String mission;

    @Column(name = "established_date")
    private LocalDate establishedDate;

    @Column(name = "industry")
    private String industry;

    @Column(name = "employee_count")
    private int employeeCount;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Employer> employers;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<Project> projects;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL)
    private List<JobAdv> jobAdvs;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
