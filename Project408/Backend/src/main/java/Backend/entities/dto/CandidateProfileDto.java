package Backend.entities.dto;
import Backend.core.enums.*;
import Backend.entities.common.CustomJobPosition;
import Backend.entities.common.JobPositions;
import java.time.LocalDate;
import java.util.List;

public class CandidateProfileDto {

    // Profile Details
    private String aboutMe;
    private Nationality nationality;
    private Gender gender;
    private MilitaryStatus militaryStatus;

    private LocalDate militaryDefermentDate;
    private DisabilityStatus disabilityStatus;
    private MaritalStatus maritalStatus;
    private Boolean currentEmploymentStatus;
    private Boolean drivingLicense;
    private Boolean isPrivateProfile;
    private String profilePicture;
    private LocalDate birthDate;

    // Social Links
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String blogUrl;
    private String otherLinksUrl;
    private String otherLinksDescription;

    // Contact Information
    private String phoneNumber;
    private Integer country;
    private Integer city;

    // Job Preferences
    private List<JobPosition> jobPositionTypes;
    private List<CustomJobPosition> customJobPositionNames;
    private WorkType preferredWorkType;
    private Integer minWorkHour;
    private Integer maxWorkHour;
    private Boolean canTravel;
    private String expectedSalary;

    // References (paralel listeler)
    private List<String> referenceName;
    private List<String> referenceCompany;
    private List<String> referenceJobTitle;
    private List<String> referenceContactInfo;
    private List<Integer> referenceYearsWorked;

    // Language Proficiency (paralel listeler)
    private List<String> languageProficiencyLanguages;
    private List<LanguageLevel> languageProficiencyReadingLevels;
    private List<LanguageLevel> languageProficiencyWritingLevels;
    private List<LanguageLevel> languageProficiencySpeakingLevels;
    private List<LanguageLevel> languageProficiencyListeningLevels;

    // Hobbies
    private List<String> hobbyName;
    private List<String> description;

    // Education (sade alanlar, nested yerine isimlerle)
    private DegreeType educationDegreeType;

    private String associateDepartmentName;
    private String associateUniversityName;
    private String associateUniversityCityName;

    private LocalDate associateStartDate;
    private LocalDate associateEndDate;
    private Boolean associateIsOngoing;

    private String bachelorDepartmentName;
    private String bachelorUniversityName;
    private String bachelorUniversityCityName;

    private LocalDate bachelorStartDate;
    private LocalDate bachelorEndDate;
    private Boolean bachelorIsOngoing;

    private String masterDepartmentName;
    private String masterUniversityName;
    private String masterUniversityCityName;

    private LocalDate masterStartDate;
    private LocalDate masterEndDate;
    private Boolean masterIsOngoing;
    private String masterThesisTitle;
    private String masterThesisDescription;
    private String masterThesisUrl;

    private String doctorateDepartmentName;
    private String doctorateUniversityName;
    private String doctorateUniversityCityName;
    private LocalDate doctorateStartDate;
    private LocalDate doctorateEndDate;
    private Boolean doctorateIsOngoing;
    private String doctorateThesisTitle;
    private String doctorateThesisDescription;
    private String doctorateThesisUrl;

    private Boolean isDoubleMajor;
    private String doubleMajorDepartmentName;
    private String doubleMajorUniversityName;
    private String doubleMajorUniversityCityName;
    private LocalDate doubleMajorStartDate;
    private LocalDate doubleMajorEndDate;
    private Boolean doubleMajorIsOngoing;

    private Boolean isMinor;
    private String minorDepartmentName;
    private String minorUniversityName;
    private String minorUniversityCityName;
    private LocalDate minorStartDate;
    private LocalDate minorEndDate;
    private Boolean minorIsOngoing;

    private List<String> certificationName;
    private List<String> certificationUrl;
    private List<LocalDate> certificateValidityDate;
    private List<String> issuedBy;

    private List<String> companyName;
    private List<String> industry;
    private List<String> jobTitle;
    private List<String> jobDescription;
    private List<EmploymentType> employmentType;
    private List<LocalDate> startDate;
    private List<LocalDate> endDate;
    private List<Boolean> isGoing;

    private List<String> examName;
    private List<Integer> examYear;
    private List<Double> examScore;
    private List<String> examRank;

    private List<String> documentName;
    private List<String> documentType;
    private List<DocumentCategory> documentCategory;
    private List<String> documentUrl;
    private List<Boolean> isPrivate;

    private List<String> skillName;
    private List<SkillLevel> skillLevel;

    private List<String> projectName;
    private List<String> projectDescription;
    private List<LocalDate> projectStartDate;
    private List<LocalDate> projectEndDate;
    private List<ProjectStatus> projectStatus;
    private List<Boolean> isPrivateProject;
    private List<String> company;


    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public Nationality getNationality() {
        return nationality;
    }

    public void setNationality(Nationality nationality) {
        this.nationality = nationality;
    }

    public Gender getGender() {
        return gender;
    }
    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public MilitaryStatus getMilitaryStatus() {
        return militaryStatus;
    }
    public void setMilitaryStatus(MilitaryStatus militaryStatus) {
        this.militaryStatus = militaryStatus;
    }

    public LocalDate getMilitaryDefermentDate() {
        return militaryDefermentDate;
    }
    public void setMilitaryDefermentDate(LocalDate militaryDefermentDate) {
        this.militaryDefermentDate = militaryDefermentDate;
    }

    public DisabilityStatus getDisabilityStatus() {
        return disabilityStatus;
    }
    public void setDisabilityStatus(DisabilityStatus disabilityStatus) {
        this.disabilityStatus = disabilityStatus;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }
    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public Boolean getCurrentEmploymentStatus() {
        return currentEmploymentStatus;
    }
    public void setCurrentEmploymentStatus(Boolean currentEmploymentStatus) {
        this.currentEmploymentStatus = currentEmploymentStatus;
    }

    public Boolean getDrivingLicense() {
        return drivingLicense;
    }
    public void setDrivingLicense(Boolean drivingLicense) {
        this.drivingLicense = drivingLicense;
    }

    public Boolean getIsPrivateProfile() {
        return isPrivateProfile;
    }
    public void setIsPrivateProfile(Boolean isPrivateProfile) {
        this.isPrivateProfile = isPrivateProfile;
    }

    public String getProfilePicture() {
        return profilePicture;
    }
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }
    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    // Social Links

    public String getGithubUrl() {
        return githubUrl;
    }
    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public String getLinkedinUrl() {
        return linkedinUrl;
    }
    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }
    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getBlogUrl() {
        return blogUrl;
    }
    public void setBlogUrl(String blogUrl) {
        this.blogUrl = blogUrl;
    }

    public String getOtherLinksUrl() {
        return otherLinksUrl;
    }
    public void setOtherLinksUrl(String otherLinksUrl) {
        this.otherLinksUrl = otherLinksUrl;
    }

    public String getOtherLinksDescription() {
        return otherLinksDescription;
    }
    public void setOtherLinksDescription(String otherLinksDescription) {
        this.otherLinksDescription = otherLinksDescription;
    }

    // Contact Information

    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getCountry() {
        return country;
    }
    public void setCountry(Integer country) {
        this.country = country;
    }

    public Integer getCity() {
        return city;
    }
    public void setCity(Integer city) {
        this.city = city;
    }
    // Job Preferences
    public List<JobPosition> getJobPositionTypes() {
        return jobPositionTypes;
    }
    public void setJobPositionTypes(List<JobPosition> jobPositionTypes) {
        this.jobPositionTypes = jobPositionTypes;
    }

    public List<CustomJobPosition> getCustomJobPositionNames() {
        return customJobPositionNames;
    }
    public void setCustomJobPositionNames(List<CustomJobPosition> customJobPositionNames) {
        this.customJobPositionNames = customJobPositionNames;
    }

    public WorkType getPreferredWorkType() {
        return preferredWorkType;
    }
    public void setPreferredWorkType(WorkType preferredWorkType) {
        this.preferredWorkType = preferredWorkType;
    }

    public Integer getMinWorkHour() {
        return minWorkHour;
    }
    public void setMinWorkHour(Integer minWorkHour) {
        this.minWorkHour = minWorkHour;
    }

    public Integer getMaxWorkHour() {
        return maxWorkHour;
    }
    public void setMaxWorkHour(Integer maxWorkHour) {
        this.maxWorkHour = maxWorkHour;
    }

    public Boolean getCanTravel() {
        return canTravel;
    }
    public void setCanTravel(Boolean canTravel) {
        this.canTravel = canTravel;
    }

    public String getExpectedSalary() {
        return expectedSalary;
    }
    public void setExpectedSalary(String expectedSalary) {
        this.expectedSalary = expectedSalary;
    }

    // References (paralel listeler)
    public List<String> getReferenceJobTitle() {
        return referenceJobTitle;
    }
    public void setReferenceJobTitle(List<String> referenceJobTitle) {
        this.referenceJobTitle = referenceJobTitle;
    }

    public List<String> getReferenceContactInfo() {
        return referenceContactInfo;
    }
    public void setReferenceContactInfo(List<String> referenceContactInfo) {
        this.referenceContactInfo = referenceContactInfo;
    }

    public List<Integer> getReferenceYearsWorked() {
        return referenceYearsWorked;
    }
    public void setReferenceYearsWorked(List<Integer> referenceYearsWorked) {
        this.referenceYearsWorked = referenceYearsWorked;
    }

    // Language Proficiency (paralel listeler)
    public List<String> getLanguageProficiencyLanguages() {
        return languageProficiencyLanguages;
    }
    public void setLanguageProficiencyLanguages(List<String> languageProficiencyLanguages) {
        this.languageProficiencyLanguages = languageProficiencyLanguages;
    }

    public List<LanguageLevel> getLanguageProficiencyReadingLevels() {
        return languageProficiencyReadingLevels;
    }
    public void setLanguageProficiencyReadingLevels(List<LanguageLevel> languageProficiencyReadingLevels) {
        this.languageProficiencyReadingLevels = languageProficiencyReadingLevels;
    }

    public List<LanguageLevel> getLanguageProficiencyWritingLevels() {
        return languageProficiencyWritingLevels;
    }
    public void setLanguageProficiencyWritingLevels(List<LanguageLevel> languageProficiencyWritingLevels) {
        this.languageProficiencyWritingLevels = languageProficiencyWritingLevels;
    }

    public List<LanguageLevel> getLanguageProficiencySpeakingLevels() {
        return languageProficiencySpeakingLevels;
    }
    public void setLanguageProficiencySpeakingLevels(List<LanguageLevel> languageProficiencySpeakingLevels) {
        this.languageProficiencySpeakingLevels = languageProficiencySpeakingLevels;
    }

    public List<LanguageLevel> getLanguageProficiencyListeningLevels() {
        return languageProficiencyListeningLevels;
    }
    public void setLanguageProficiencyListeningLevels(List<LanguageLevel> languageProficiencyListeningLevels) {
        this.languageProficiencyListeningLevels = languageProficiencyListeningLevels;
    }

    // Hobbies
    public List<String> getHobbyName() {
        return hobbyName;
    }
    public void setHobbyName(List<String> hobbyName) {
        this.hobbyName = hobbyName;
    }

    public List<String> getDescription() {
        return description;
    }
    public void setDescription(List<String> description) {
        this.description = description;
    }
    public DegreeType getEducationDegreeType() {
        return educationDegreeType;
    }
    public void setEducationDegreeType(DegreeType educationDegreeType) {
        this.educationDegreeType = educationDegreeType;
    }

    public String getAssociateDepartmentName() {
        return associateDepartmentName;
    }
    public void setAssociateDepartmentName(String associateDepartmentName) {
        this.associateDepartmentName = associateDepartmentName;
    }

    public String getAssociateUniversityName() {
        return associateUniversityName;
    }
    public void setAssociateUniversityName(String associateUniversityName) {
        this.associateUniversityName = associateUniversityName;
    }

    public String getAssociateUniversityCityName() {
        return associateUniversityCityName;
    }
    public void setAssociateUniversityCityName(String associateUniversityCityName) {
        this.associateUniversityCityName = associateUniversityCityName;
    }

    public LocalDate getAssociateStartDate() {
        return associateStartDate;
    }
    public void setAssociateStartDate(LocalDate associateStartDate) {
        this.associateStartDate = associateStartDate;
    }

    public LocalDate getAssociateEndDate() {
        return associateEndDate;
    }
    public void setAssociateEndDate(LocalDate associateEndDate) {
        this.associateEndDate = associateEndDate;
    }

    public Boolean getAssociateIsOngoing() {
        return associateIsOngoing;
    }
    public void setAssociateIsOngoing(Boolean associateIsOngoing) {
        this.associateIsOngoing = associateIsOngoing;
    }

    public String getBachelorDepartmentName() {
        return bachelorDepartmentName;
    }
    public void setBachelorDepartmentName(String bachelorDepartmentName) {
        this.bachelorDepartmentName = bachelorDepartmentName;
    }

    public String getBachelorUniversityName() {
        return bachelorUniversityName;
    }
    public void setBachelorUniversityName(String bachelorUniversityName) {
        this.bachelorUniversityName = bachelorUniversityName;
    }

    public String getBachelorUniversityCityName() {
        return bachelorUniversityCityName;
    }
    public void setBachelorUniversityCityName(String bachelorUniversityCityName) {
        this.bachelorUniversityCityName = bachelorUniversityCityName;
    }

    public LocalDate getBachelorStartDate() {
        return bachelorStartDate;
    }
    public void setBachelorStartDate(LocalDate bachelorStartDate) {
        this.bachelorStartDate = bachelorStartDate;
    }

    public LocalDate getBachelorEndDate() {
        return bachelorEndDate;
    }
    public void setBachelorEndDate(LocalDate bachelorEndDate) {
        this.bachelorEndDate = bachelorEndDate;
    }

    public Boolean getBachelorIsOngoing() {
        return bachelorIsOngoing;
    }
    public void setBachelorIsOngoing(Boolean bachelorIsOngoing) {
        this.bachelorIsOngoing = bachelorIsOngoing;
    }

    public String getMasterDepartmentName() {
        return masterDepartmentName;
    }
    public void setMasterDepartmentName(String masterDepartmentName) {
        this.masterDepartmentName = masterDepartmentName;
    }

    public String getMasterUniversityName() {
        return masterUniversityName;
    }
    public void setMasterUniversityName(String masterUniversityName) {
        this.masterUniversityName = masterUniversityName;
    }

    public String getMasterUniversityCityName() {
        return masterUniversityCityName;
    }
    public void setMasterUniversityCityName(String masterUniversityCityName) {
        this.masterUniversityCityName = masterUniversityCityName;
    }

    public LocalDate getMasterStartDate() {
        return masterStartDate;
    }
    public void setMasterStartDate(LocalDate masterStartDate) {
        this.masterStartDate = masterStartDate;
    }

    public LocalDate getMasterEndDate() {
        return masterEndDate;
    }
    public void setMasterEndDate(LocalDate masterEndDate) {
        this.masterEndDate = masterEndDate;
    }

    public Boolean getMasterIsOngoing() {
        return masterIsOngoing;
    }
    public void setMasterIsOngoing(Boolean masterIsOngoing) {
        this.masterIsOngoing = masterIsOngoing;
    }

    public String getMasterThesisTitle() {
        return masterThesisTitle;
    }
    public void setMasterThesisTitle(String masterThesisTitle) {
        this.masterThesisTitle = masterThesisTitle;
    }

    public String getMasterThesisDescription() {
        return masterThesisDescription;
    }
    public void setMasterThesisDescription(String masterThesisDescription) {
        this.masterThesisDescription = masterThesisDescription;
    }

    public String getMasterThesisUrl() {
        return masterThesisUrl;
    }
    public void setMasterThesisUrl(String masterThesisUrl) {
        this.masterThesisUrl = masterThesisUrl;
    }

    public String getDoctorateDepartmentName() {
        return doctorateDepartmentName;
    }
    public void setDoctorateDepartmentName(String doctorateDepartmentName) {
        this.doctorateDepartmentName = doctorateDepartmentName;
    }

    public String getDoctorateUniversityName() {
        return doctorateUniversityName;
    }
    public void setDoctorateUniversityName(String doctorateUniversityName) {
        this.doctorateUniversityName = doctorateUniversityName;
    }

    public String getDoctorateUniversityCityName() {
        return doctorateUniversityCityName;
    }
    public void setDoctorateUniversityCityName(String doctorateUniversityCityName) {
        this.doctorateUniversityCityName = doctorateUniversityCityName;
    }

    public LocalDate getDoctorateStartDate() {
        return doctorateStartDate;
    }
    public void setDoctorateStartDate(LocalDate doctorateStartDate) {
        this.doctorateStartDate = doctorateStartDate;
    }

    public LocalDate getDoctorateEndDate() {
        return doctorateEndDate;
    }
    public void setDoctorateEndDate(LocalDate doctorateEndDate) {
        this.doctorateEndDate = doctorateEndDate;
    }

    public Boolean getDoctorateIsOngoing() {
        return doctorateIsOngoing;
    }
    public void setDoctorateIsOngoing(Boolean doctorateIsOngoing) {
        this.doctorateIsOngoing = doctorateIsOngoing;
    }

    public String getDoctorateThesisTitle() {
        return doctorateThesisTitle;
    }
    public void setDoctorateThesisTitle(String doctorateThesisTitle) {
        this.doctorateThesisTitle = doctorateThesisTitle;
    }

    public String getDoctorateThesisDescription() {
        return doctorateThesisDescription;
    }
    public void setDoctorateThesisDescription(String doctorateThesisDescription) {
        this.doctorateThesisDescription = doctorateThesisDescription;
    }

    public String getDoctorateThesisUrl() {
        return doctorateThesisUrl;
    }
    public void setDoctorateThesisUrl(String doctorateThesisUrl) {
        this.doctorateThesisUrl = doctorateThesisUrl;
    }

    public Boolean getIsDoubleMajor() {
        return isDoubleMajor;
    }
    public void setIsDoubleMajor(Boolean isDoubleMajor) {
        this.isDoubleMajor = isDoubleMajor;
    }

    public String getDoubleMajorDepartmentName() {
        return doubleMajorDepartmentName;
    }
    public void setDoubleMajorDepartmentName(String doubleMajorDepartmentName) {
        this.doubleMajorDepartmentName = doubleMajorDepartmentName;
    }

    public String getDoubleMajorUniversityName() {
        return doubleMajorUniversityName;
    }
    public void setDoubleMajorUniversityName(String doubleMajorUniversityName) {
        this.doubleMajorUniversityName = doubleMajorUniversityName;
    }

    public String getDoubleMajorUniversityCityName() {
        return doubleMajorUniversityCityName;
    }
    public void setDoubleMajorUniversityCityName(String doubleMajorUniversityCityName) {
        this.doubleMajorUniversityCityName = doubleMajorUniversityCityName;
    }

    public LocalDate getDoubleMajorStartDate() {
        return doubleMajorStartDate;
    }
    public void setDoubleMajorStartDate(LocalDate doubleMajorStartDate) {
        this.doubleMajorStartDate = doubleMajorStartDate;
    }

    public LocalDate getDoubleMajorEndDate() {
        return doubleMajorEndDate;
    }
    public void setDoubleMajorEndDate(LocalDate doubleMajorEndDate) {
        this.doubleMajorEndDate = doubleMajorEndDate;
    }

    public Boolean getDoubleMajorIsOngoing() {
        return doubleMajorIsOngoing;
    }
    public void setDoubleMajorIsOngoing(Boolean doubleMajorIsOngoing) {
        this.doubleMajorIsOngoing = doubleMajorIsOngoing;
    }

    public Boolean getIsMinor() {
        return isMinor;
    }
    public void setIsMinor(Boolean isMinor) {
        this.isMinor = isMinor;
    }

    public String getMinorDepartmentName() {
        return minorDepartmentName;
    }
    public void setMinorDepartmentName(String minorDepartmentName) {
        this.minorDepartmentName = minorDepartmentName;
    }

    public String getMinorUniversityName() {
        return minorUniversityName;
    }
    public void setMinorUniversityName(String minorUniversityName) {
        this.minorUniversityName = minorUniversityName;
    }

    public String getMinorUniversityCityName() {
        return minorUniversityCityName;
    }
    public void setMinorUniversityCityName(String minorUniversityCityName) {
        this.minorUniversityCityName = minorUniversityCityName;
    }

    public LocalDate getMinorStartDate() {
        return minorStartDate;
    }
    public void setMinorStartDate(LocalDate minorStartDate) {
        this.minorStartDate = minorStartDate;
    }

    public LocalDate getMinorEndDate() {
        return minorEndDate;
    }
    public void setMinorEndDate(LocalDate minorEndDate) {
        this.minorEndDate = minorEndDate;
    }

    public Boolean getMinorIsOngoing() {
        return minorIsOngoing;
    }
    public void setMinorIsOngoing(Boolean minorIsOngoing) {
        this.minorIsOngoing = minorIsOngoing;
    }
    public List<String> getCertificationName() {
        return certificationName;
    }

    public void setCertificationName(List<String> certificationName) {
        this.certificationName = certificationName;
    }

    public List<String> getCertificationUrl() {
        return certificationUrl;
    }

    public void setCertificationUrl(List<String> certificationUrl) {
        this.certificationUrl = certificationUrl;
    }

    public List<LocalDate> getCertificateValidityDate() {
        return certificateValidityDate;
    }

    public void setCertificateValidityDate(List<LocalDate> certificateValidityDate) {
        this.certificateValidityDate = certificateValidityDate;
    }

    public List<String> getIssuedBy() {
        return issuedBy;
    }

    public void setIssuedBy(List<String> issuedBy) {
        this.issuedBy = issuedBy;
    }

    public List<String> getCompanyName() {
        return companyName;
    }

    public void setCompanyName(List<String> companyName) {
        this.companyName = companyName;
    }

    public List<String> getIndustry() {
        return industry;
    }

    public void setIndustry(List<String> industry) {
        this.industry = industry;
    }

    public List<String> getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(List<String> jobTitle) {
        this.jobTitle = jobTitle;
    }

    public List<String> getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(List<String> jobDescription) {
        this.jobDescription = jobDescription;
    }

    public List<EmploymentType> getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(List<EmploymentType> employmentType) {
        this.employmentType = employmentType;
    }

    public List<LocalDate> getStartDate() {
        return startDate;
    }

    public void setStartDate(List<LocalDate> startDate) {
        this.startDate = startDate;
    }

    public List<LocalDate> getEndDate() {
        return endDate;
    }

    public void setEndDate(List<LocalDate> endDate) {
        this.endDate = endDate;
    }

    public List<Boolean> getIsGoing() {
        return isGoing;
    }

    public void setIsGoing(List<Boolean> isGoing) {
        this.isGoing = isGoing;
    }

    public List<String> getExamName() {
        return examName;
    }

    public void setExamName(List<String> examName) {
        this.examName = examName;
    }

    public List<Integer> getExamYear() {
        return examYear;
    }

    public void setExamYear(List<Integer> examYear) {
        this.examYear = examYear;
    }

    public List<Double> getExamScore() {
        return examScore;
    }

    public void setExamScore(List<Double> examScore) {
        this.examScore = examScore;
    }

    public List<String> getExamRank() {
        return examRank;
    }

    public void setExamRank(List<String> examRank) {
        this.examRank = examRank;
    }

    public List<String> getDocumentName() {
        return documentName;
    }

    public void setDocumentName(List<String> documentName) {
        this.documentName = documentName;
    }

    public List<String> getDocumentType() {
        return documentType;
    }

    public void setDocumentType(List<String> documentType) {
        this.documentType = documentType;
    }

    public List<DocumentCategory> getDocumentCategory() {
        return documentCategory;
    }

    public void setDocumentCategory(List<DocumentCategory> documentCategory) {
        this.documentCategory = documentCategory;
    }

    public List<String> getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(List<String> documentUrl) {
        this.documentUrl = documentUrl;
    }

    public List<Boolean> getIsPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(List<Boolean> isPrivate) {
        this.isPrivate = isPrivate;
    }

    public List<String> getSkillName() {
        return skillName;
    }

    public void setSkillName(List<String> skillName) {
        this.skillName = skillName;
    }

    public List<SkillLevel> getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(List<SkillLevel> skillLevel) {
        this.skillLevel = skillLevel;
    }

    public List<String> getProjectName() {
        return projectName;
    }

    public void setProjectName(List<String> projectName) {
        this.projectName = projectName;
    }

    public List<String> getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(List<String> projectDescription) {
        this.projectDescription = projectDescription;
    }

    public List<LocalDate> getProjectStartDate() {
        return projectStartDate;
    }

    public void setProjectStartDate(List<LocalDate> projectStartDate) {
        this.projectStartDate = projectStartDate;
    }

    public List<LocalDate> getProjectEndDate() {
        return projectEndDate;
    }

    public void setProjectEndDate(List<LocalDate> projectEndDate) {
        this.projectEndDate = projectEndDate;
    }

    public List<ProjectStatus> getProjectStatus() {
        return projectStatus;
    }

    public void setProjectStatus(List<ProjectStatus> projectStatus) {
        this.projectStatus = projectStatus;
    }

    public List<Boolean> getIsPrivateProject() {
        return isPrivateProject;
    }

    public void setIsPrivateProject(List<Boolean> isPrivateProject) {
        this.isPrivateProject = isPrivateProject;
    }

    public List<String> getCompany() {
        return company;
    }

    public void setCompany(List<String> company) {
        this.company = company;
    }

    public List<String> getReferenceName() {
        return referenceName;
    }

    public void setReferenceName(List<String> referenceName) {
        this.referenceName = referenceName;
    }

    public List<String> getReferenceCompany() {
        return referenceCompany;
    }

    public void setReferenceCompany(List<String> referenceCompany) {
        this.referenceCompany = referenceCompany;
    }
}
