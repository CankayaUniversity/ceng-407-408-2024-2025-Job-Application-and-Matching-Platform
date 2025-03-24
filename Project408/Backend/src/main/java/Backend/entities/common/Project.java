package Backend.entities.common;

import Backend.core.enums.ProjectStatus;
import Backend.entities.BaseEntity;
import Backend.entities.company.Company;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
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
    private Company company;
}
