package Backend.entities.user.candidate;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import Backend.entities.BaseEntity;

@Entity
@Getter
@Setter
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
}
