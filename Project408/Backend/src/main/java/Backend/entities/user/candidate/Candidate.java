package Backend.entities.user.candidate;

import Backend.entities.common.Project;
import Backend.entities.user.User;
import Backend.entities.common.LanguageProficiency;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "candidates")
public class Candidate extends User {

    private String firstName;

    private String lastName;

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
}
