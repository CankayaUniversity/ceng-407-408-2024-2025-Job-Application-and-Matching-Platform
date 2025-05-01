package Backend.entities.dto;

import Backend.core.enums.EmploymentType;
import Backend.core.enums.WorkType;

import java.time.LocalDate;
import java.util.List;

public class JobApplicationDto {
    private int id;
    private String description;
    private Double minSalary;
    private Double maxSalary;
    private LocalDate lastDate;
    private boolean travelRest;
    private boolean license;
    private List<String> jobPositions;
    private WorkType workType;
    private EmploymentType employmentType;
    private String country;
    private Integer minWorkHours;
    private Integer maxWorkHours;
    private String degreeType;
    private String jobExperience;
    private Integer experienceYears;
    private String militaryStatus;
    private List<String> technicalSkills;
    private List<String> socialSkills;
    private List<String> languageProficiencies;
    private List<String> benefitTypes;
    private List<String> benefitDescriptions;
    private List<String> positionTypes;
    private List<String> customJobPositions;
    private String companyName;
    private Boolean contactPermission;
    private Boolean referancePermission;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMinSalary() {
        return minSalary;
    }

    public void setMinSalary(Double minSalary) {
        this.minSalary = minSalary;
    }

    public Double getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(Double maxSalary) {
        this.maxSalary = maxSalary;
    }

    public LocalDate getLastDate() {
        return lastDate;
    }

    public void setLastDate(LocalDate lastDate) {
        this.lastDate = lastDate;
    }

    public boolean isTravelRest() {
        return travelRest;
    }

    public void setTravelRest(boolean travelRest) {
        this.travelRest = travelRest;
    }

    public boolean isLicense() {
        return license;
    }

    public void setLicense(boolean license) {
        this.license = license;
    }

    public List<String> getJobPositions() {
        return jobPositions;
    }

    public void setJobPositions(List<String> jobPositions) {
        this.jobPositions = jobPositions;
    }

    public WorkType getWorkType() {
        return workType;
    }

    public void setWorkType(WorkType workType) {
        this.workType = workType;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Integer getMinWorkHours() {
        return minWorkHours;
    }

    public void setMinWorkHours(Integer minWorkHours) {
        this.minWorkHours = minWorkHours;
    }

    public Integer getMaxWorkHours() {
        return maxWorkHours;
    }

    public void setMaxWorkHours(Integer maxWorkHours) {
        this.maxWorkHours = maxWorkHours;
    }

    public String getDegreeType() {
        return degreeType;
    }

    public void setDegreeType(String degreeType) {
        this.degreeType = degreeType;
    }

    public String getJobExperience() {
        return jobExperience;
    }

    public void setJobExperience(String jobExperience) {
        this.jobExperience = jobExperience;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getMilitaryStatus() {
        return militaryStatus;
    }

    public void setMilitaryStatus(String militaryStatus) {
        this.militaryStatus = militaryStatus;
    }

    public List<String> getTechnicalSkills() {
        return technicalSkills;
    }

    public void setTechnicalSkills(List<String> technicalSkills) {
        this.technicalSkills = technicalSkills;
    }

    public List<String> getSocialSkills() {
        return socialSkills;
    }

    public void setSocialSkills(List<String> socialSkills) {
        this.socialSkills = socialSkills;
    }

    public List<String> getLanguageProficiencies() {
        return languageProficiencies;
    }

    public void setLanguageProficiencies(List<String> languageProficiencies) {
        this.languageProficiencies = languageProficiencies;
    }

    public List<String> getBenefitTypes() {
        return benefitTypes;
    }

    public void setBenefitTypes(List<String> benefitTypes) {
        this.benefitTypes = benefitTypes;
    }

    public List<String> getBenefitDescriptions() {
        return benefitDescriptions;
    }

    public void setBenefitDescriptions(List<String> benefitDescriptions) {
        this.benefitDescriptions = benefitDescriptions;
    }

    public List<String> getPositionTypes() {
        return positionTypes;
    }

    public void setPositionTypes(List<String> positionTypes) {
        this.positionTypes = positionTypes;
    }

    public List<String> getCustomJobPositions() {
        return customJobPositions;
    }

    public void setCustomJobPositions(List<String> customJobPositions) {
        this.customJobPositions = customJobPositions;
    }
    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Boolean getContactPermission() {
        return contactPermission;
    }

    public void setContactPermission(Boolean contactPermission) {
        this.contactPermission = contactPermission;
    }

    public Boolean getReferancePermission() {
        return referancePermission;
    }

    public void setReferancePermission(Boolean referancePermission) {
        this.referancePermission = referancePermission;
    }
}
