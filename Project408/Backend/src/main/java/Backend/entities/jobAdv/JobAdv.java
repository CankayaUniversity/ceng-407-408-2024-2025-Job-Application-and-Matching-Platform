package Backend.entities.jobAdv;

import Backend.entities.BaseEntity;
import Backend.entities.common.JobPositions;
import Backend.entities.company.Company;
import Backend.entities.user.candidate.JobApplication;
import Backend.entities.user.employer.Employer;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_advs")
public class JobAdv extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "company_id")
    @JsonBackReference("jobadv_1")
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

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "benefit_id")
    @JsonManagedReference("jobadv_4")
    private List<Benefit> benefits;

    @OneToMany(mappedBy = "jobAdv", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("jobadv_3")
    private List<JobPositions> jobPositions;

    @OneToMany(mappedBy = "jobAdv", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("jobadv_6")
    private List<JobApplication> jobApplication;

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Employer getCreatedEmployer() {
        return createdEmployer;
    }

    public void setCreatedEmployer(Employer createdEmployer) {
        this.createdEmployer = createdEmployer;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMinSalary() {
        return minSalary;
    }

    public void setMinSalary(Double minSalary) {
        this.minSalary = minSalary;
    }

    public Double getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(Double maxSalary) {
        this.maxSalary = maxSalary;
    }

    public LocalDate getLastDate() {
        return lastDate;
    }

    public void setLastDate(LocalDate lastDate) {
        this.lastDate = lastDate;
    }

    public boolean isTravelRest() {
        return travelRest;
    }

    public void setTravelRest(boolean travelRest) {
        this.travelRest = travelRest;
    }

    public boolean isLicense() {
        return license;
    }

    public void setLicense(boolean license) {
        this.license = license;
    }

    public JobCondition getJobCondition() {
        return jobCondition;
    }

    public void setJobCondition(JobCondition jobCondition) {
        this.jobCondition = jobCondition;
    }

    public JobQualification getJobQualification() {
        return jobQualification;
    }

    public void setJobQualification(JobQualification jobQualification) {
        this.jobQualification = jobQualification;
    }

    public List<Benefit> getBenefits() {
        return benefits;
    }

    public void setBenefits(List<Benefit> benefits) {
        this.benefits = benefits;
    }

    public List<JobPositions> getJobPositions() {
        return jobPositions;
    }

    public void setJobPositions(List<JobPositions> jobPositions) {
        this.jobPositions = jobPositions;
    }

    public List<JobApplication> getJobApplication() {
        return jobApplication;
    }

    public void setJobApplication(List<JobApplication> jobApplication) {
        this.jobApplication = jobApplication;
    }
}
    
