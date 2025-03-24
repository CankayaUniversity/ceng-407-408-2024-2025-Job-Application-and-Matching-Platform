package Backend.entities.jobAdv;

import Backend.core.enums.SkillLevel;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "technical_skills")
public class TechnicalSkill extends BaseEntity {

    @Column(name = "position_name", nullable = false)
    private String positionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_level", nullable = false)
    private SkillLevel skillLevel;

    @Column(name = "description", length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "job_qualification_id")
    private JobQualification jobQualification;
}
