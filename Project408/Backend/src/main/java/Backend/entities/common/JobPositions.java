package Backend.entities.common;

import Backend.core.enums.JobPosition;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_positions")
public class JobPositions extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "position_type", nullable = false)
    private JobPosition positionType;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "custom_job_position_id")
    private CustomJobPosition customJobPosition;
}
