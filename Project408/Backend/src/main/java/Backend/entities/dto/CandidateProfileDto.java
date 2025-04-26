package Backend.entities.dto;

import Backend.entities.common.LanguageProficiency;
import Backend.entities.common.Project;
import Backend.entities.user.candidate.*;
import lombok.*;

import java.util.List;

@Getter
public class CandidateProfileDto {
    private String firstName;
    private ProfileDetails profileDetails;
    private SocialLinks socialLinks;
    private ContactInformation contactInformation;
    private JobPreferences jobPreferences;
    private List<Reference> references;
    private List<LanguageProficiency> languageProficiency;
    private List<Hobby> hobbies;
    private Education education;
    private List<Certification> certifications;
    private List<WorkExperience> workExperiences;
    private List<ExamAndAchievement> examsAndAchievements;
    private List<UploadedDocument> uploadedDocuments;
    private List<Skill> skills;
    private List<Project> projects;

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setProfileDetails(ProfileDetails profileDetails) {
        this.profileDetails = profileDetails;
    }

    public void setSocialLinks(SocialLinks socialLinks) {
        this.socialLinks = socialLinks;
    }

    public void setContactInformation(ContactInformation contactInformation) {
        this.contactInformation = contactInformation;
    }

    public void setJobPreferences(JobPreferences jobPreferences) {
        this.jobPreferences = jobPreferences;
    }

    public void setReferences(List<Reference> references) {
        this.references = references;
    }

    public void setLanguageProficiency(List<LanguageProficiency> languageProficiency) {
        this.languageProficiency = languageProficiency;
    }

    public void setHobbies(List<Hobby> hobbies) {
        this.hobbies = hobbies;
    }

    public void setEducation(Education education) {
        this.education = education;
    }

    public void setCertifications(List<Certification> certifications) {
        this.certifications = certifications;
    }

    public void setWorkExperiences(List<WorkExperience> workExperiences) {
        this.workExperiences = workExperiences;
    }

    public void setExamsAndAchievements(List<ExamAndAchievement> examsAndAchievements) {
        this.examsAndAchievements = examsAndAchievements;
    }

    public void setUploadedDocuments(List<UploadedDocument> uploadedDocuments) {
        this.uploadedDocuments = uploadedDocuments;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }
}
