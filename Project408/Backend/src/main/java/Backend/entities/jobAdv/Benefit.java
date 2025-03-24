package Backend.entities.jobAdv;

import Backend.core.enums.BenefitType;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "benefit")
public class Benefit extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "benefit_type", nullable = false)
    private BenefitType benefitType;

    @Column(name = "description", length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "job_adv_id")
    private JobAdv jobAdv;
}
