package Backend.entities.common;

import Backend.core.enums.JobPosition;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity

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

    public JobPosition getPositionType() {
        return positionType;
    }

    public void setPositionType(JobPosition positionType) {
        this.positionType = positionType;
    }

    public CustomJobPosition getCustomJobPosition() {
        return customJobPosition;
    }

    public void setCustomJobPosition(CustomJobPosition customJobPosition) {
        this.customJobPosition = customJobPosition;
    }
}
