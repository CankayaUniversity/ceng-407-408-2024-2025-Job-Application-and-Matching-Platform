package Backend.entities.user.candidate;

import Backend.core.enums.DegreeType;
import Backend.core.location.Department;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "educations")
public class Education extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "degree_type")
    private DegreeType degreeType;

    // Associate Degree
    @ManyToOne
    @JoinColumn(name = "associate_department_id")
    private Department associateDepartment;

    private LocalDate associateStartDate;
    private LocalDate associateEndDate;
    private boolean associateIsOngoing;

    // Bachelor
    @ManyToOne
    @JoinColumn(name = "bachelor_department_id")
    private Department bachelorDepartment;

    private LocalDate bachelorStartDate;
    private LocalDate bachelorEndDate;
    private boolean bachelorIsOngoing;

    // Master
    @ManyToOne
    @JoinColumn(name = "master_department_id")
    private Department masterDepartment;

    private LocalDate masterStartDate;
    private LocalDate masterEndDate;
    private boolean masterIsOngoing;

    private String masterThesisTitle;
    private String masterThesisDescription;
    private String masterThesisUrl;

    // Doctorate
    @ManyToOne
    @JoinColumn(name = "doctorate_department_id")
    private Department doctorateDepartment;

    private LocalDate doctorateStartDate;
    private LocalDate doctorateEndDate;
    private boolean doctorateIsOngoing;

    private String doctorateThesisTitle;
    private String doctorateThesisDescription;
    private String doctorateThesisUrl;

    // Double Major
    private boolean isDoubleMajor;

    @ManyToOne
    @JoinColumn(name = "double_major_department_id")
    private Department doubleMajorDepartment;

    private LocalDate doubleMajorStartDate;
    private LocalDate doubleMajorEndDate;
    private boolean doubleMajorIsOngoing;

    // Minor
    private boolean isMinor;

    @ManyToOne
    @JoinColumn(name = "minor_department_id")
    private Department minorDepartment;

    private LocalDate minorStartDate;
    private LocalDate minorEndDate;
    private boolean minorIsOngoing;
}
