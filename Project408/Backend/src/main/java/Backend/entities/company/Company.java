package Backend.entities.company;

import Backend.entities.BaseEntity;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.common.Project;
import Backend.entities.user.employer.Employer;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity

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
    private String employeeCount;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JsonManagedReference("employers") // Prevents circular references during serialization
    private List<Employer> employers;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JsonManagedReference("projects")
    private List<Project> projects;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JsonManagedReference ("jobadv_1")// Prevents circular references during serialization
    private List<JobAdv> jobAdvs;

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getVision() {
        return vision;
    }

    public void setVision(String vision) {
        this.vision = vision;
    }

    public String getMission() {
        return mission;
    }

    public void setMission(String mission) {
        this.mission = mission;
    }

    public LocalDate getEstablishedDate() {
        return establishedDate;
    }

    public void setEstablishedDate(LocalDate establishedDate) {
        this.establishedDate = establishedDate;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(String employeeCount) {
        this.employeeCount = employeeCount;
    }

    public List<Employer> getEmployers() {
        return employers;
    }

    public void setEmployers(List<Employer> employers) {
        this.employers = employers;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<JobAdv> getJobAdvs() {
        return jobAdvs;
    }

    public void setJobAdvs(List<JobAdv> jobAdvs) {
        this.jobAdvs = jobAdvs;
    }
}
