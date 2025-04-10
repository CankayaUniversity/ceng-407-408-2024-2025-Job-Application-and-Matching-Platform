package Backend.entities.offer;

import Backend.entities.user.candidate.JobApplication;
import Backend.entities.user.employer.Employer;
import Backend.core.enums.OfferStatus;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_offers")
public class JobOffer extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "application_id")
    private JobApplication application;

    @ManyToOne
    @JoinColumn(name = "employer_id")
    private Employer employer;

    @Column(name = "salary_offer")
    private Double salaryOffer;

    @Column(name = "work_hours")
    private String workHours;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "location")
    private String location;

    @Column(name = "benefits", length = 500)
    private String benefits;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OfferStatus status = OfferStatus.PENDING;
}
