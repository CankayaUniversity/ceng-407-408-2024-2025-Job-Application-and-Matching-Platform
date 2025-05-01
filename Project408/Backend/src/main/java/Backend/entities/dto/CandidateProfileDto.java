package Backend.entities.dto;

import java.util.Date;

public class CandidateProfileDto {

    private String firstname;
    private String lastname;
    private String aboutme;
    private Date birthdate;
    private Boolean currentemploymentstatus;
    private String disabilitystatus;
    private Boolean drivinglicense;
    private String gender;
    private String maritalstatus;
    private Date militarydefermentdate;
    private String militarystatus;
    private String nationality;
    private String profilepicture;
    private Boolean canTravel;
    private Integer expectedSalary;
    private Integer maxWorkHour;
    private Integer minWorkHour;
    private String preferredWorkType;
    private String blogUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String otherLinksDescription;
    private String otherLinksUrl;
    private String websiteUrl;
    private String companyName;
    private String employmentType;
    private Date endDate;
    private String industry;
    private Boolean isGoing;
    private String jobDescription;
    private String jobTitle;
    private Date startDate;

    // Constructor
    public CandidateProfileDto(String firstname, String lastname, String aboutme, Date birthdate,
                               Boolean currentemploymentstatus, String disabilitystatus, Boolean drivinglicense,
                               String gender, String maritalstatus, Date militarydefermentdate, String militarystatus,
                               String nationality, String profilepicture, Boolean canTravel, Integer expectedSalary,
                               Integer maxWorkHour, Integer minWorkHour, String preferredWorkType, String blogUrl,
                               String githubUrl, String linkedinUrl, String otherLinksDescription, String otherLinksUrl,
                               String websiteUrl, String companyName, String employmentType, Date endDate,
                               String industry, Boolean isGoing, String jobDescription, String jobTitle, Date startDate) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.aboutme = aboutme;
        this.birthdate = birthdate;
        this.currentemploymentstatus = currentemploymentstatus;
        this.disabilitystatus = disabilitystatus;
        this.drivinglicense = drivinglicense;
        this.gender = gender;
        this.maritalstatus = maritalstatus;
        this.militarydefermentdate = militarydefermentdate;
        this.militarystatus = militarystatus;
        this.nationality = nationality;
        this.profilepicture = profilepicture;
        this.canTravel = canTravel;
        this.expectedSalary = expectedSalary;
        this.maxWorkHour = maxWorkHour;
        this.minWorkHour = minWorkHour;
        this.preferredWorkType = preferredWorkType;
        this.blogUrl = blogUrl;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.otherLinksDescription = otherLinksDescription;
        this.otherLinksUrl = otherLinksUrl;
        this.websiteUrl = websiteUrl;
        this.companyName = companyName;
        this.employmentType = employmentType;
        this.endDate = endDate;
        this.industry = industry;
        this.isGoing = isGoing;
        this.jobDescription = jobDescription;
        this.jobTitle = jobTitle;
        this.startDate = startDate;
    }

    // Getter ve Setter metodları
    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getAboutme() {
        return aboutme;
    }

    public void setAboutme(String aboutme) {
        this.aboutme = aboutme;
    }

    public Date getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Date birthdate) {
        this.birthdate = birthdate;
    }

    public Boolean getCurrentemploymentstatus() {
        return currentemploymentstatus;
    }

    public void setCurrentemploymentstatus(Boolean currentemploymentstatus) {
        this.currentemploymentstatus = currentemploymentstatus;
    }

    public String getDisabilitystatus() {
        return disabilitystatus;
    }

    public void setDisabilitystatus(String disabilitystatus) {
        this.disabilitystatus = disabilitystatus;
    }

    public Boolean getDrivinglicense() {
        return drivinglicense;
    }

    public void setDrivinglicense(Boolean drivinglicense) {
        this.drivinglicense = drivinglicense;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getMaritalstatus() {
        return maritalstatus;
    }

    public void setMaritalstatus(String maritalstatus) {
        this.maritalstatus = maritalstatus;
    }

    public Date getMilitarydefermentdate() {
        return militarydefermentdate;
    }

    public void setMilitarydefermentdate(Date militarydefermentdate) {
        this.militarydefermentdate = militarydefermentdate;
    }

    public String getMilitarystatus() {
        return militarystatus;
    }

    public void setMilitarystatus(String militarystatus) {
        this.militarystatus = militarystatus;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getProfilepicture() {
        return profilepicture;
    }

    public void setProfilepicture(String profilepicture) {
        this.profilepicture = profilepicture;
    }

    public Boolean getCanTravel() {
        return canTravel;
    }

    public void setCanTravel(Boolean canTravel) {
        this.canTravel = canTravel;
    }

    public Integer getExpectedSalary() {
        return expectedSalary;
    }

    public void setExpectedSalary(Integer expectedSalary) {
        this.expectedSalary = expectedSalary;
    }

    public Integer getMaxWorkHour() {
        return maxWorkHour;
    }

    public void setMaxWorkHour(Integer maxWorkHour) {
        this.maxWorkHour = maxWorkHour;
    }

    public Integer getMinWorkHour() {
        return minWorkHour;
    }

    public void setMinWorkHour(Integer minWorkHour) {
        this.minWorkHour = minWorkHour;
    }

    public String getPreferredWorkType() {
        return preferredWorkType;
    }

    public void setPreferredWorkType(String preferredWorkType) {
        this.preferredWorkType = preferredWorkType;
    }

    public String getBlogUrl() {
        return blogUrl;
    }

    public void setBlogUrl(String blogUrl) {
        this.blogUrl = blogUrl;
    }

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

    public String getOtherLinksDescription() {
        return otherLinksDescription;
    }

    public void setOtherLinksDescription(String otherLinksDescription) {
        this.otherLinksDescription = otherLinksDescription;
    }

    public String getOtherLinksUrl() {
        return otherLinksUrl;
    }

    public void setOtherLinksUrl(String otherLinksUrl) {
        this.otherLinksUrl = otherLinksUrl;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public Boolean getIsGoing() {
        return isGoing;
    }

    public void setIsGoing(Boolean isGoing) {
        this.isGoing = isGoing;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }
}
