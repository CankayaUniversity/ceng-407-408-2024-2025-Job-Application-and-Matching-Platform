package Backend.entities.common;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "custom_job_positions")
public class CustomJobPosition extends BaseEntity {

    @Column(name = "position_name", nullable = false)
    private String positionName;
}
