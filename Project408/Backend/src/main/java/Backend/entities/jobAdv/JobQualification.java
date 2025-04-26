package Backend.entities.jobAdv;

import Backend.core.enums.DegreeType;
import Backend.core.enums.JobExperience;
import Backend.core.enums.MilitaryStatus;
import Backend.entities.BaseEntity;
import Backend.entities.common.LanguageProficiency;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity

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

    @OneToMany(mappedBy = "jobQualification", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<TechnicalSkill> technicalSkills;

    @OneToMany(mappedBy = "jobQualification", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<SocialSkill> socialSkills;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "job_qualification_id")
    private List<LanguageProficiency> languageProficiencies;

    @OneToOne(mappedBy = "jobQualification")
    @JsonBackReference // Prevents circular references during serialization
    private JobAdv jobAdv;

    public DegreeType getDegreeType() {
        return degreeType;
    }

    public void setDegreeType(DegreeType degreeType) {
        this.degreeType = degreeType;
    }

    public JobExperience getJobExperience() {
        return jobExperience;
    }

    public void setJobExperience(JobExperience jobExperience) {
        this.jobExperience = jobExperience;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }

    public MilitaryStatus getMilitaryStatus() {
        return militaryStatus;
    }

    public void setMilitaryStatus(MilitaryStatus militaryStatus) {
        this.militaryStatus = militaryStatus;
    }

    public List<TechnicalSkill> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(List<TechnicalSkill> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    public List<SocialSkill> getSocialSkills() {
        return socialSkills;
    }

    public void setSocialSkills(List<SocialSkill> socialSkills) {
        this.socialSkills = socialSkills;
    }

    public List<LanguageProficiency> getLanguageProficiencies() {
        return languageProficiencies;
    }

    public void setLanguageProficiencies(List<LanguageProficiency> languageProficiencies) {
        this.languageProficiencies = languageProficiencies;
    }

    public JobAdv getJobAdv() {
        return jobAdv;
    }

    public void setJobAdv(JobAdv jobAdv) {
        this.jobAdv = jobAdv;
    }
}
