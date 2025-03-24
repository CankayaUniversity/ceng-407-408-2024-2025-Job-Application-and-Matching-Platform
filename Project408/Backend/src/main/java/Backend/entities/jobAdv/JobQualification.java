package Backend.entities.jobAdv;

import Backend.core.enums.DegreeType;
import Backend.core.enums.JobExperience;
import Backend.core.enums.MilitaryStatus;
import Backend.entities.BaseEntity;
import Backend.entities.common.LanguageProficiency;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_qualifications")
public class JobQualification extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "degree_type", nullable = false)
    private DegreeType degreeType;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_experience", nullable = false)
    private JobExperience jobExperience;

    @Column(name = "experience_years")
    private int experienceYears;

    @Enumerated(EnumType.STRING)
    @Column(name = "military_status")
    private MilitaryStatus militaryStatus;

    @OneToMany(mappedBy = "jobQualification", cascade = CascadeType.ALL)
    private List<TechnicalSkill> technicalSkills;

    @OneToMany(mappedBy = "jobQualification", cascade = CascadeType.ALL)
    private List<SocialSkill> socialSkills;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "job_qualification_id")
    private List<LanguageProficiency> languageProficiencies;

    @OneToOne(mappedBy = "jobQualification")
    private JobAdv jobAdv;
}
