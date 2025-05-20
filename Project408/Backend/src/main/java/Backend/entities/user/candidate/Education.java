package Backend.entities.user.candidate;

import Backend.core.enums.DegreeType;
import Backend.core.location.Department;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "educations")
public class Education extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "degree_type")
    private DegreeType degreeType;

    // Associate Degree
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "associate_department_id")
    private Department associateDepartment;

    private LocalDate associateStartDate;
    private LocalDate associateEndDate;
    private boolean associateIsOngoing;

    // Bachelor
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bachelor_department_id")
    private Department bachelorDepartment;

    private LocalDate bachelorStartDate;
    private LocalDate bachelorEndDate;
    private boolean bachelorIsOngoing;

    // Master
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "master_department_id")
    private Department masterDepartment;

    private LocalDate masterStartDate;
    private LocalDate masterEndDate;
    private boolean masterIsOngoing;

    private String masterThesisTitle;
    private String masterThesisDescription;
    private String masterThesisUrl;

    // Doctorate
    @ManyToOne(cascade = CascadeType.ALL)
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

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "double_major_department_id")
    private Department doubleMajorDepartment;

    private LocalDate doubleMajorStartDate;
    private LocalDate doubleMajorEndDate;
    private boolean doubleMajorIsOngoing;

    // Minor
    private boolean isMinor;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "minor_department_id")
    private Department minorDepartment;

    private LocalDate minorStartDate;
    private LocalDate minorEndDate;
    private boolean minorIsOngoing;

    public DegreeType getDegreeType() {
        return degreeType;
    }

    public void setDegreeType(DegreeType degreeType) {
        this.degreeType = degreeType;
    }

    public Department getAssociateDepartment() {
        return associateDepartment;
    }

    public void setAssociateDepartment(Department associateDepartment) {
        this.associateDepartment = associateDepartment;
    }

    public LocalDate getAssociateStartDate() {
        return associateStartDate;
    }

    public void setAssociateStartDate(LocalDate associateStartDate) {
        this.associateStartDate = associateStartDate;
    }

    public LocalDate getAssociateEndDate() {
        return associateEndDate;
    }

    public void setAssociateEndDate(LocalDate associateEndDate) {
        this.associateEndDate = associateEndDate;
    }

    public boolean isAssociateIsOngoing() {
        return associateIsOngoing;
    }

    public void setAssociateIsOngoing(boolean associateIsOngoing) {
        this.associateIsOngoing = associateIsOngoing;
    }

    public Department getBachelorDepartment() {
        return bachelorDepartment;
    }

    public void setBachelorDepartment(Department bachelorDepartment) {
        this.bachelorDepartment = bachelorDepartment;
    }

    public LocalDate getBachelorStartDate() {
        return bachelorStartDate;
    }

    public void setBachelorStartDate(LocalDate bachelorStartDate) {
        this.bachelorStartDate = bachelorStartDate;
    }

    public LocalDate getBachelorEndDate() {
        return bachelorEndDate;
    }

    public void setBachelorEndDate(LocalDate bachelorEndDate) {
        this.bachelorEndDate = bachelorEndDate;
    }

    public boolean isBachelorIsOngoing() {
        return bachelorIsOngoing;
    }

    public void setBachelorIsOngoing(boolean bachelorIsOngoing) {
        this.bachelorIsOngoing = bachelorIsOngoing;
    }

    public Department getMasterDepartment() {
        return masterDepartment;
    }

    public void setMasterDepartment(Department masterDepartment) {
        this.masterDepartment = masterDepartment;
    }

    public LocalDate getMasterStartDate() {
        return masterStartDate;
    }

    public void setMasterStartDate(LocalDate masterStartDate) {
        this.masterStartDate = masterStartDate;
    }

    public LocalDate getMasterEndDate() {
        return masterEndDate;
    }

    public void setMasterEndDate(LocalDate masterEndDate) {
        this.masterEndDate = masterEndDate;
    }

    public boolean isMasterIsOngoing() {
        return masterIsOngoing;
    }

    public void setMasterIsOngoing(boolean masterIsOngoing) {
        this.masterIsOngoing = masterIsOngoing;
    }

    public String getMasterThesisTitle() {
        return masterThesisTitle;
    }

    public void setMasterThesisTitle(String masterThesisTitle) {
        this.masterThesisTitle = masterThesisTitle;
    }

    public String getMasterThesisDescription() {
        return masterThesisDescription;
    }

    public void setMasterThesisDescription(String masterThesisDescription) {
        this.masterThesisDescription = masterThesisDescription;
    }

    public String getMasterThesisUrl() {
        return masterThesisUrl;
    }

    public void setMasterThesisUrl(String masterThesisUrl) {
        this.masterThesisUrl = masterThesisUrl;
    }

    public Department getDoctorateDepartment() {
        return doctorateDepartment;
    }

    public void setDoctorateDepartment(Department doctorateDepartment) {
        this.doctorateDepartment = doctorateDepartment;
    }

    public LocalDate getDoctorateStartDate() {
        return doctorateStartDate;
    }

    public void setDoctorateStartDate(LocalDate doctorateStartDate) {
        this.doctorateStartDate = doctorateStartDate;
    }

    public LocalDate getDoctorateEndDate() {
        return doctorateEndDate;
    }

    public void setDoctorateEndDate(LocalDate doctorateEndDate) {
        this.doctorateEndDate = doctorateEndDate;
    }

    public boolean isDoctorateIsOngoing() {
        return doctorateIsOngoing;
    }

    public void setDoctorateIsOngoing(boolean doctorateIsOngoing) {
        this.doctorateIsOngoing = doctorateIsOngoing;
    }

    public String getDoctorateThesisTitle() {
        return doctorateThesisTitle;
    }

    public void setDoctorateThesisTitle(String doctorateThesisTitle) {
        this.doctorateThesisTitle = doctorateThesisTitle;
    }

    public String getDoctorateThesisDescription() {
        return doctorateThesisDescription;
    }

    public void setDoctorateThesisDescription(String doctorateThesisDescription) {
        this.doctorateThesisDescription = doctorateThesisDescription;
    }

    public String getDoctorateThesisUrl() {
        return doctorateThesisUrl;
    }

    public void setDoctorateThesisUrl(String doctorateThesisUrl) {
        this.doctorateThesisUrl = doctorateThesisUrl;
    }

    public boolean isDoubleMajor() {
        return isDoubleMajor;
    }

    public void setDoubleMajor(boolean doubleMajor) {
        isDoubleMajor = doubleMajor;
    }

    public Department getDoubleMajorDepartment() {
        return doubleMajorDepartment;
    }

    public void setDoubleMajorDepartment(Department doubleMajorDepartment) {
        this.doubleMajorDepartment = doubleMajorDepartment;
    }

    public LocalDate getDoubleMajorStartDate() {
        return doubleMajorStartDate;
    }

    public void setDoubleMajorStartDate(LocalDate doubleMajorStartDate) {
        this.doubleMajorStartDate = doubleMajorStartDate;
    }

    public LocalDate getDoubleMajorEndDate() {
        return doubleMajorEndDate;
    }

    public void setDoubleMajorEndDate(LocalDate doubleMajorEndDate) {
        this.doubleMajorEndDate = doubleMajorEndDate;
    }

    public boolean isDoubleMajorIsOngoing() {
        return doubleMajorIsOngoing;
    }

    public void setDoubleMajorIsOngoing(boolean doubleMajorIsOngoing) {
        this.doubleMajorIsOngoing = doubleMajorIsOngoing;
    }

    public boolean isMinor() {
        return isMinor;
    }

    public void setMinor(boolean minor) {
        isMinor = minor;
    }

    public Department getMinorDepartment() {
        return minorDepartment;
    }

    public void setMinorDepartment(Department minorDepartment) {
        this.minorDepartment = minorDepartment;
    }

    public LocalDate getMinorStartDate() {
        return minorStartDate;
    }

    public void setMinorStartDate(LocalDate minorStartDate) {
        this.minorStartDate = minorStartDate;
    }

    public LocalDate getMinorEndDate() {
        return minorEndDate;
    }

    public void setMinorEndDate(LocalDate minorEndDate) {
        this.minorEndDate = minorEndDate;
    }

    public boolean isMinorIsOngoing() {
        return minorIsOngoing;
    }

    public void setMinorIsOngoing(boolean minorIsOngoing) {
        this.minorIsOngoing = minorIsOngoing;
    }
}
