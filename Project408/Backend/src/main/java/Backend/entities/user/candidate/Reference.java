package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "references_info")
public class Reference extends BaseEntity {

    @Column(name = "reference_name", nullable = false)
    private String referenceName;

    @Column(name = "reference_job_title")
    private String referenceJobTitle;

    @Column(name = "reference_company")
    private String referenceCompany;

    @Column(name = "reference_contact_info")
    private String referenceContactInfo;

    @Column(name = "reference_years_worked")
    private String referenceYearsWorked;

    public String getReferenceName() {
        return referenceName;
    }

    public void setReferenceName(String referenceName) {
        this.referenceName = referenceName;
    }

    public String getReferenceJobTitle() {
        return referenceJobTitle;
    }

    public void setReferenceJobTitle(String referenceJobTitle) {
        this.referenceJobTitle = referenceJobTitle;
    }

    public String getReferenceCompany() {
        return referenceCompany;
    }

    public void setReferenceCompany(String referenceCompany) {
        this.referenceCompany = referenceCompany;
    }

    public String getReferenceContactInfo() {
        return referenceContactInfo;
    }

    public void setReferenceContactInfo(String referenceContactInfo) {
        this.referenceContactInfo = referenceContactInfo;
    }

    public String getReferenceYearsWorked() {
        return referenceYearsWorked;
    }

    public void setReferenceYearsWorked(String referenceYearsWorked) {
        this.referenceYearsWorked = referenceYearsWorked;
    }
}
