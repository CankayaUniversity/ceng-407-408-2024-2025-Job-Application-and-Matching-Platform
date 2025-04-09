package Backend.entities.user.candidate;

import Backend.entities.common.Project;
import Backend.entities.user.User;
import Backend.entities.common.LanguageProficiency;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.List;
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "candidates")

public class Candidate extends User {

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_details_id")
    private ProfileDetails profileDetails;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "social_links_id")
    private SocialLinks socialLinks;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "contact_info_id")
    private ContactInformation contactInformation;

    @OneToOne(cascade = CascadeType.ALL)
    private JobPreferences jobPreferences;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<Reference> references;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<LanguageProficiency> languageProficiency;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<Hobby> hobbies;

    @OneToOne(cascade = CascadeType.ALL)
    private Education education;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<Certification> certifications;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<WorkExperience> workExperiences;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<ExamAndAchievement> examsAndAchievements;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<UploadedDocument> uploadedDocuments;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<Skill> skills;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "candidate_id")
    private List<Project> projects;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<JobApplication> jobApplications;

    // Getter ve setter metodları
    public List<JobApplication> getJobApplications() {
        return jobApplications;
    }

    public void setJobApplications(List<JobApplication> jobApplications) {
        this.jobApplications = jobApplications;
    }

    // Getter and Setter methods


    public ProfileDetails getProfileDetails() {
        return profileDetails;
    }

    public void setProfileDetails(ProfileDetails profileDetails) {
        this.profileDetails = profileDetails;
    }

    public SocialLinks getSocialLinks() {
        return socialLinks;
    }

    public void setSocialLinks(SocialLinks socialLinks) {
        this.socialLinks = socialLinks;
    }

    public ContactInformation getContactInformation() {
        return contactInformation;
    }

    public void setContactInformation(ContactInformation contactInformation) {
        this.contactInformation = contactInformation;
    }

    public JobPreferences getJobPreferences() {
        return jobPreferences;
    }

    public void setJobPreferences(JobPreferences jobPreferences) {
        this.jobPreferences = jobPreferences;
    }

    public List<Reference> getReferences() {
        return references;
    }

    public void setReferences(List<Reference> references) {
        this.references = references;
    }

    public List<LanguageProficiency> getLanguageProficiency() {
        return languageProficiency;
    }

    public void setLanguageProficiency(List<LanguageProficiency> languageProficiency) {
        this.languageProficiency = languageProficiency;
    }

    public List<Hobby> getHobbies() {
        return hobbies;
    }

    public void setHobbies(List<Hobby> hobbies) {
        this.hobbies = hobbies;
    }

    public Education getEducation() {
        return education;
    }

    public void setEducation(Education education) {
        this.education = education;
    }

    public List<Certification> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<Certification> certifications) {
        this.certifications = certifications;
    }

    public List<WorkExperience> getWorkExperiences() {
        return workExperiences;
    }

    public void setWorkExperiences(List<WorkExperience> workExperiences) {
        this.workExperiences = workExperiences;
    }

    public List<ExamAndAchievement> getExamsAndAchievements() {
        return examsAndAchievements;
    }

    public void setExamsAndAchievements(List<ExamAndAchievement> examsAndAchievements) {
        this.examsAndAchievements = examsAndAchievements;
    }

    public List<UploadedDocument> getUploadedDocuments() {
        return uploadedDocuments;
    }

    public void setUploadedDocuments(List<UploadedDocument> uploadedDocuments) {
        this.uploadedDocuments = uploadedDocuments;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }
}
