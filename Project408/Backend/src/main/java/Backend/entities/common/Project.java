package Backend.entities.common;

import Backend.core.enums.ProjectStatus;
import Backend.entities.BaseEntity;
import Backend.entities.company.Company;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "projects")
public class Project extends BaseEntity {

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "project_description", length = 1000)
    private String projectDescription;

    @Column(name = "project_start_date")
    private LocalDate projectStartDate;

    @Column(name = "project_end_date")
    private LocalDate projectEndDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "project_status", nullable = false)
    private ProjectStatus projectStatus;

    @Column(name = "is_private")
    private boolean isPrivate;

    @ManyToOne
    @JoinColumn(name = "company_id")
    @JsonBackReference("projects")
    private Company company;

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public LocalDate getProjectStartDate() {
        return projectStartDate;
    }

    public void setProjectStartDate(LocalDate projectStartDate) {
        this.projectStartDate = projectStartDate;
    }

    public LocalDate getProjectEndDate() {
        return projectEndDate;
    }

    public void setProjectEndDate(LocalDate projectEndDate) {
        this.projectEndDate = projectEndDate;
    }

    public ProjectStatus getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(ProjectStatus projectStatus) {
        this.projectStatus = projectStatus;
    }

    public boolean getIsPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(boolean aPrivate) {
        this.isPrivate = aPrivate;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
