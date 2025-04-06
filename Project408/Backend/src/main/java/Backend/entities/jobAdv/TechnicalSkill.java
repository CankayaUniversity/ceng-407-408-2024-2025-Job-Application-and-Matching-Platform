package Backend.entities.jobAdv;

import Backend.core.enums.SkillLevel;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity

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

    public String getPositionName() {
        return positionName;
    }

    public void setPositionName(String positionName) {
        this.positionName = positionName;
    }

    public SkillLevel getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(SkillLevel skillLevel) {
        this.skillLevel = skillLevel;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public JobQualification getJobQualification() {
        return jobQualification;
    }

    public void setJobQualification(JobQualification jobQualification) {
        this.jobQualification = jobQualification;
    }
}
