package Backend.entities.user.candidate;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import Backend.entities.BaseEntity;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "certifications")
public class Certification extends BaseEntity{

    @Column(name = "certification_name", nullable = false)
    private String certificationName;

    @Column(name = "certification_url")
    private String certificationUrl;

    @Column(name = "certificate_validity_date")
    private LocalDate certificateValidityDate;

    @Column(name = "issued_by")
    private String issuedBy;

    public String getCertificationName() {
        return certificationName;
    }

    public void setCertificationName(String certificationName) {
        this.certificationName = certificationName;
    }

    public String getCertificationUrl() {
        return certificationUrl;
    }

    public void setCertificationUrl(String certificationUrl) {
        this.certificationUrl = certificationUrl;
    }

    public LocalDate getCertificateValidityDate() {
        return certificateValidityDate;
    }

    public void setCertificateValidityDate(LocalDate certificateValidityDate) {
        this.certificateValidityDate = certificateValidityDate;
    }

    public String getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(String issuedBy) {
        this.issuedBy = issuedBy;
    }
}
