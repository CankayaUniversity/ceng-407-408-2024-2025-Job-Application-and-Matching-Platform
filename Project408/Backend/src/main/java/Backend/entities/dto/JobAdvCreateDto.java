package Backend.entities.dto;

import Backend.core.enums.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
@Data
public class JobAdvCreateDto {

    private Integer companyId;

    private String description;
    private Double minSalary;
    private Double maxSalary;
    private LocalDate lastDate;
    private Boolean travelRest;
    private Boolean license;

    private WorkType jobConditionWorkType;
    private EmploymentType jobConditionEmploymentType;
    private Integer jobConditionCountry;
    private Integer jobConditionCity;
    private Integer jobConditionMinWorkHours;
    private Integer jobConditionMaxWorkHours;

    private DegreeType jobQualificationDegreeType;
    private JobExperience jobQualificationJobExperience;
    private Integer jobQualificationExperienceYears;
    private MilitaryStatus jobQualificationMilitaryStatus;

    private List<String> technicalSkillPositionNames;
    private List<SkillLevel> technicalSkillLevels;
    private List<String> technicalSkillDescriptions;

    private List<String> socialSkillPositionNames;
    private List<SkillLevel> socialSkillLevels;
    private List<String> socialSkillDescriptions;

    private List<String> languageProficiencyLanguages;
    private List<LanguageLevel> languageProficiencyReadingLevels;
    private List<LanguageLevel> languageProficiencyWritingLevels;
    private List<LanguageLevel> languageProficiencySpeakingLevels;
    private List<LanguageLevel> languageProficiencyListeningLevels;

    private List<BenefitType> benefitTypes;
    private List<String> benefitDescriptions;

    private List<JobPosition> jobPositionTypes;
    private List<String> customJobPositionNames;

    // --- GETTER & SETTER ---

    public Integer getCompanyId() { return companyId; }
    public void setCompanyId(Integer companyId) { this.companyId = companyId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getMinSalary() { return minSalary; }
    public void setMinSalary(Double minSalary) { this.minSalary = minSalary; }

    public Double getMaxSalary() { return maxSalary; }
    public void setMaxSalary(Double maxSalary) { this.maxSalary = maxSalary; }

    public LocalDate getLastDate() { return lastDate; }
    public void setLastDate(LocalDate lastDate) { this.lastDate = lastDate; }

    public Boolean getTravelRest() { return travelRest; }
    public void setTravelRest(Boolean travelRest) { this.travelRest = travelRest; }

    public Boolean getLicense() { return license; }
    public void setLicense(Boolean license) { this.license = license; }

    public WorkType getJobConditionWorkType() { return jobConditionWorkType; }
    public void setJobConditionWorkType(WorkType jobConditionWorkType) { this.jobConditionWorkType = jobConditionWorkType; }

    public EmploymentType getJobConditionEmploymentType() { return jobConditionEmploymentType; }
    public void setJobConditionEmploymentType(EmploymentType jobConditionEmploymentType) { this.jobConditionEmploymentType = jobConditionEmploymentType; }

    public Integer getJobConditionCountry() { return jobConditionCountry; }
    public void setJobConditionCountry(Integer jobConditionCountry) { this.jobConditionCountry = jobConditionCountry; }

    public Integer getJobConditionCity() { return jobConditionCity; }
    public void setJobConditionCity(Integer jobConditionCity) { this.jobConditionCity = jobConditionCity; }

    public Integer getJobConditionMinWorkHours() { return jobConditionMinWorkHours; }
    public void setJobConditionMinWorkHours(Integer jobConditionMinWorkHours) { this.jobConditionMinWorkHours = jobConditionMinWorkHours; }

    public Integer getJobConditionMaxWorkHours() { return jobConditionMaxWorkHours; }
    public void setJobConditionMaxWorkHours(Integer jobConditionMaxWorkHours) { this.jobConditionMaxWorkHours = jobConditionMaxWorkHours; }

    public DegreeType getJobQualificationDegreeType() { return jobQualificationDegreeType; }
    public void setJobQualificationDegreeType(DegreeType jobQualificationDegreeType) { this.jobQualificationDegreeType = jobQualificationDegreeType; }

    public JobExperience getJobQualificationJobExperience() { return jobQualificationJobExperience; }
    public void setJobQualificationJobExperience(JobExperience jobQualificationJobExperience) { this.jobQualificationJobExperience = jobQualificationJobExperience; }

    public Integer getJobQualificationExperienceYears() { return jobQualificationExperienceYears; }
    public void setJobQualificationExperienceYears(Integer jobQualificationExperienceYears) { this.jobQualificationExperienceYears = jobQualificationExperienceYears; }

    public MilitaryStatus getJobQualificationMilitaryStatus() { return jobQualificationMilitaryStatus; }
    public void setJobQualificationMilitaryStatus(MilitaryStatus jobQualificationMilitaryStatus) { this.jobQualificationMilitaryStatus = jobQualificationMilitaryStatus; }

    public List<String> getTechnicalSkillPositionNames() { return technicalSkillPositionNames; }
    public void setTechnicalSkillPositionNames(List<String> technicalSkillPositionNames) { this.technicalSkillPositionNames = technicalSkillPositionNames; }

    public List<SkillLevel> getTechnicalSkillLevels() { return technicalSkillLevels; }
    public void setTechnicalSkillLevels(List<SkillLevel> technicalSkillLevels) { this.technicalSkillLevels = technicalSkillLevels; }

    public List<String> getTechnicalSkillDescriptions() { return technicalSkillDescriptions; }
    public void setTechnicalSkillDescriptions(List<String> technicalSkillDescriptions) { this.technicalSkillDescriptions = technicalSkillDescriptions; }

    public List<String> getSocialSkillPositionNames() { return socialSkillPositionNames; }
    public void setSocialSkillPositionNames(List<String> socialSkillPositionNames) { this.socialSkillPositionNames = socialSkillPositionNames; }

    public List<SkillLevel> getSocialSkillLevels() { return socialSkillLevels; }
    public void setSocialSkillLevels(List<SkillLevel> socialSkillLevels) { this.socialSkillLevels = socialSkillLevels; }

    public List<String> getSocialSkillDescriptions() { return socialSkillDescriptions; }
    public void setSocialSkillDescriptions(List<String> socialSkillDescriptions) { this.socialSkillDescriptions = socialSkillDescriptions; }

    public List<String> getLanguageProficiencyLanguages() { return languageProficiencyLanguages; }
    public void setLanguageProficiencyLanguages(List<String> languageProficiencyLanguages) { this.languageProficiencyLanguages = languageProficiencyLanguages; }

    public List<LanguageLevel> getLanguageProficiencyReadingLevels() { return languageProficiencyReadingLevels; }
    public void setLanguageProficiencyReadingLevels(List<LanguageLevel> languageProficiencyReadingLevels) { this.languageProficiencyReadingLevels = languageProficiencyReadingLevels; }

    public List<LanguageLevel> getLanguageProficiencyWritingLevels() { return languageProficiencyWritingLevels; }
    public void setLanguageProficiencyWritingLevels(List<LanguageLevel> languageProficiencyWritingLevels) { this.languageProficiencyWritingLevels = languageProficiencyWritingLevels; }

    public List<LanguageLevel> getLanguageProficiencySpeakingLevels() { return languageProficiencySpeakingLevels; }
    public void setLanguageProficiencySpeakingLevels(List<LanguageLevel> languageProficiencySpeakingLevels) { this.languageProficiencySpeakingLevels = languageProficiencySpeakingLevels; }

    public List<LanguageLevel> getLanguageProficiencyListeningLevels() { return languageProficiencyListeningLevels; }
    public void setLanguageProficiencyListeningLevels(List<LanguageLevel> languageProficiencyListeningLevels) { this.languageProficiencyListeningLevels = languageProficiencyListeningLevels; }

    public List<BenefitType> getBenefitTypes() { return benefitTypes; }
    public void setBenefitTypes(List<BenefitType> benefitTypes) { this.benefitTypes = benefitTypes; }

    public List<String> getBenefitDescriptions() { return benefitDescriptions; }
    public void setBenefitDescriptions(List<String> benefitDescriptions) { this.benefitDescriptions = benefitDescriptions; }

    public List<JobPosition> getJobPositionTypes() { return jobPositionTypes; }
    public void setJobPositionTypes(List<JobPosition> jobPositionTypes) { this.jobPositionTypes = jobPositionTypes; }

    public List<String> getCustomJobPositionNames() { return customJobPositionNames; }
    public void setCustomJobPositionNames(List<String> customJobPositionNames) { this.customJobPositionNames = customJobPositionNames; }
}
