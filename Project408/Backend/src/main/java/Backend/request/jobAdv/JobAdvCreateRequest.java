package Backend.request.jobAdv;

import Backend.core.enums.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;


@NoArgsConstructor
@AllArgsConstructor
public class JobAdvCreateRequest {

    private int employerId; // Şimdilik ThunderClient'ten manuel verilecek

    private String description;
    private Double minSalary;
    private Double maxSalary;
    private LocalDate deadline;
    private boolean travelRest;
    private boolean license;

    // JobCondition
    private WorkType workType;
    private EmploymentType employmentType;
    private int countryId;
    private int minWorkHours;
    private int maxWorkHours;

    // JobQualification
    private DegreeType degreeType;
    private JobExperience jobExperience;
    private int experienceYears;
    private MilitaryStatus militaryStatus;

    private List<String> technicalSkills;  // skillName listesi
    private List<String> socialSkills;     // skillName listesi

    private List<Integer> languageProficiencyIds;  // Daha önce eklenmiş ID’ler

    private List<Integer> benefitTypeIds;  // Enum’lardan alınabilir ya da string list de olabilir
    private List<Integer> jobPositionIds;

    public int getEmployerId() {
        return employerId;
    }

    public void setEmployerId(int employerId) {
        this.employerId = employerId;
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

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
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

    public int getCountryId() {
        return countryId;
    }

    public void setCountryId(int countryId) {
        this.countryId = countryId;
    }

    public int getMinWorkHours() {
        return minWorkHours;
    }

    public void setMinWorkHours(int minWorkHours) {
        this.minWorkHours = minWorkHours;
    }

    public int getMaxWorkHours() {
        return maxWorkHours;
    }

    public void setMaxWorkHours(int maxWorkHours) {
        this.maxWorkHours = maxWorkHours;
    }


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

    public List<Integer> getLanguageProficiencyIds() {
        return languageProficiencyIds;
    }

    public void setLanguageProficiencyIds(List<Integer> languageProficiencyIds) {
        this.languageProficiencyIds = languageProficiencyIds;
    }

    public List<Integer> getBenefitTypeIds() {
        return benefitTypeIds;
    }

    public void setBenefitTypeIds(List<Integer> benefitTypeIds) {
        this.benefitTypeIds = benefitTypeIds;
    }

    public List<Integer> getJobPositionIds() {
        return jobPositionIds;
    }

    public void setJobPositionIds(List<Integer> jobPositionIds) {
        this.jobPositionIds = jobPositionIds;
    }
}
