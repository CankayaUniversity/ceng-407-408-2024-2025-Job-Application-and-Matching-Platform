package Backend.services;

import Backend.core.enums.ApplicationStatus;
import Backend.core.enums.JobAdvStatus;
import Backend.entities.common.LanguageProficiency;
import Backend.entities.common.Project;
import Backend.entities.dto.CandidateProfileDto;
import Backend.entities.dto.ReferenceDto;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.User;
import Backend.entities.user.candidate.*;
import Backend.repository.*;
import jakarta.transaction.Transactional;
import org.apache.coyote.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;

@Service

public class CandidateService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    CandidateRepository candidateRepository;
    @Autowired
    SocialLinksRepository socialLinksRepository;
    @Autowired
    ProfileDetailsRepository profileDetailsRepository;
    @Autowired
    ContactInformationRepository contactInformationRepository;
    @Autowired
    JobPreferencesRepository jobPreferencesRepository;
    @Autowired
    ReferenceRepository referenceRepository;
    @Autowired
    LanguageProficiencyRepository languageProficiencyRepository;
    @Autowired
    HobbyRepository hobbyRepository;
    @Autowired
    EducationRepository educationRepository;
    @Autowired
    CertificationRepository certificationRepository;
    @Autowired
    WorkExperienceRepository workExperienceRepository;
    @Autowired
    ExamAndAchievementRepository examAndAchievementRepository;
    @Autowired
    UploadedDocumentRepository uploadedDocumentRepository;
    @Autowired
    SkillRepository skillRepository;
    @Autowired
    ProjectRepository projectRepository;
    @Autowired
    private JobAdvRepository jobAdvRepository;
    @Autowired
    private JobApplicationRepository jobApplicationRepository;
    @Autowired
    CountryRepository countryRepository;
    CityRepository cityRepository;

    @Transactional
    public Candidate createProfile(String email, Candidate candidate) {
        // E-posta adresine göre kullanıcıyı bul
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }

        // Kullanıcıya ait yeni profil oluştur
        Candidate newCandidate = (Candidate) user; // Downcasting

        // ProfileDetails kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getProfileDetails() != null) {
            ProfileDetails profileDetails = candidate.getProfileDetails();
            newCandidate.setProfileDetails(profileDetails);
        }

        // SocialLinks kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getSocialLinks() != null) {
            SocialLinks socialLinks = candidate.getSocialLinks();
            newCandidate.setSocialLinks(socialLinks);
        }

        // ContactInformation kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getContactInformation() != null) {
            ContactInformation contactInformation = candidate.getContactInformation();
            newCandidate.setContactInformation(contactInformation);
        }

        // JobPreferences kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getJobPreferences() != null) {
            JobPreferences jobPreferences = candidate.getJobPreferences();
            newCandidate.setJobPreferences(jobPreferences);
        }

        // References kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getReferences() != null && !candidate.getReferences().isEmpty()) {
            List<Reference> references = candidate.getReferences();
            newCandidate.setReferences(references);
        }

        // LanguageProficiency kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getLanguageProficiency() != null && !candidate.getLanguageProficiency().isEmpty()) {
            List<LanguageProficiency> languageProficiency = candidate.getLanguageProficiency();
            newCandidate.setLanguageProficiency(languageProficiency);
        }

        // Hobby kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getHobbies() != null && !candidate.getHobbies().isEmpty()) {
            List<Hobby> hobbies = candidate.getHobbies();
            newCandidate.setHobbies(hobbies);
        }

        // Education kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getEducation() != null) {
            Education education = candidate.getEducation();
            newCandidate.setEducation(education);
        }

        // Certifications kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getCertifications() != null && !candidate.getCertifications().isEmpty()) {
            List<Certification> certifications = candidate.getCertifications();
            newCandidate.setCertifications(certifications);
        }

        // WorkExperiences kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getWorkExperiences() != null && !candidate.getWorkExperiences().isEmpty()) {
            List<WorkExperience> workExperiences = candidate.getWorkExperiences();
            newCandidate.setWorkExperiences(workExperiences);
        }

        // ExamsAndAchievements kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getExamsAndAchievements() != null && !candidate.getExamsAndAchievements().isEmpty()) {
            List<ExamAndAchievement> examsAndAchievements = candidate.getExamsAndAchievements();
            newCandidate.setExamsAndAchievements(examsAndAchievements);
        }

        // UploadedDocuments kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getUploadedDocuments() != null && !candidate.getUploadedDocuments().isEmpty()) {
            List<UploadedDocument> uploadedDocuments = candidate.getUploadedDocuments();
            newCandidate.setUploadedDocuments(uploadedDocuments);
        }

        // Skills kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getSkills() != null && !candidate.getSkills().isEmpty()) {
            List<Skill> skills = candidate.getSkills();
            newCandidate.setSkills(skills);
        }

        // Projects kaydet ve ilişkilendir (Null kontrolü ile)
        if (candidate.getProjects() != null && !candidate.getProjects().isEmpty()) {
            List<Project> projects = candidate.getProjects();
            newCandidate.setProjects(projects);
        }

        // Kullanıcı tipini set et
        newCandidate.setUserType(user.getUserType());

        // Yeni Candidate objesini kaydet
        candidateRepository.save(newCandidate);

        return newCandidate;
    }

    @Transactional
    public Candidate updateProfile(String email, Candidate candidate) {
        // E-posta adresine göre kullanıcıyı bul
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        Candidate existingCandidate = (Candidate) user;

        // İlişkili verileri güncelle
        if (candidate.getProfileDetails() != null) {
            ProfileDetails profileDetails = candidate.getProfileDetails();
            existingCandidate.setProfileDetails(profileDetails);
        }

        if (candidate.getSocialLinks() != null) {
            SocialLinks socialLinks = candidate.getSocialLinks();
            existingCandidate.setSocialLinks(socialLinks);
        }

        if (candidate.getContactInformation() != null) {
            ContactInformation contactInformation = candidate.getContactInformation();

            // City ve Country nesnelerini kontrol et ve kaydet
            if (contactInformation.getCountry() != null && contactInformation.getCountry().getId() == null) {
                // Country kaydetme işlemi
                countryRepository.save(contactInformation.getCountry());
            }
            if (contactInformation.getCity() != null && contactInformation.getCity().getId() == null) {
                // City kaydetme işlemi
                cityRepository.save(contactInformation.getCity());
            }

            existingCandidate.setContactInformation(contactInformation);
        }
        if (candidate.getJobPreferences() != null) {
            JobPreferences jobPreferences = candidate.getJobPreferences();
            existingCandidate.setJobPreferences(jobPreferences);
        }

        // Referansları güncelle
        if (candidate.getReferences() != null) {
            List<Reference> references = candidate.getReferences();

            existingCandidate.setReferences(references);
        }

        // Dil bilgilerini güncelle
        if (candidate.getLanguageProficiency() != null) {
            List<LanguageProficiency> languageProficiency = candidate.getLanguageProficiency();

            existingCandidate.setLanguageProficiency(languageProficiency);
        }

        // Hobileri güncelle
        if (candidate.getHobbies() != null) {
            List<Hobby> hobbies = candidate.getHobbies();

            existingCandidate.setHobbies(hobbies);
        }

        // Eğitim bilgilerini güncelle
        if (candidate.getEducation() != null) {
            Education education = candidate.getEducation();
            existingCandidate.setEducation(education);
        }

        // Sertifikaları güncelle
        if (candidate.getCertifications() != null) {
            List<Certification> certifications = candidate.getCertifications();

            existingCandidate.setCertifications(certifications);
        }

        // İş deneyimlerini güncelle
        if (candidate.getWorkExperiences() != null) {
            List<WorkExperience> workExperiences = candidate.getWorkExperiences();

            existingCandidate.setWorkExperiences(workExperiences);
        }

        // Sınav ve başarı bilgilerini güncelle
        if (candidate.getExamsAndAchievements() != null) {
            List<ExamAndAchievement> examsAndAchievements = candidate.getExamsAndAchievements();

            existingCandidate.setExamsAndAchievements(examsAndAchievements);
        }

        // Yüklenen belgeleri güncelle
        if (candidate.getUploadedDocuments() != null) {
            List<UploadedDocument> uploadedDocuments = candidate.getUploadedDocuments();

            existingCandidate.setUploadedDocuments(uploadedDocuments);
        }

        // Yetenekleri güncelle
        if (candidate.getSkills() != null) {
            List<Skill> skills = candidate.getSkills();

            existingCandidate.setSkills(skills);
        }

        // Projeleri güncelle
        if (candidate.getProjects() != null) {
            List<Project> projects = candidate.getProjects();

            existingCandidate.setProjects(projects);
        }

        // Profil güncelleme işlemini kaydet
        candidateRepository.save(existingCandidate);

        return existingCandidate;
    }
    @Transactional
    public ResponseEntity<String> deleteProfile(String email) {
        // Kullanıcıyı bul
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Eğer kullanıcı Candidate değilse hata ver
        if (!(user instanceof Candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        Candidate candidate = (Candidate) user;

        // Candidate doğrudan silinir ve ilişkili tüm veriler de otomatik olarak silinir
        // Önce candidate'ı sil
        candidateRepository.delete(candidate);

        // Sonra user'ı sil
        userRepository.delete(user);

        return new ResponseEntity<>(HttpStatus.OK);
    }


    public void applyToJobAdv(String email, Integer id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Eğer kullanıcı Candidate değilse hata ver
        if (!(user instanceof Candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        JobAdv jobAdv = jobAdvRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("JobAdv not found"));

        JobApplication jobApplication = new JobApplication();
        jobApplication.setCandidate((Candidate) user);
        jobApplication.setJobAdv(jobAdv);
        jobApplication.setApplicationDate(LocalDate.now());
        jobApplication.setStatus(ApplicationStatus.PENDING);
        jobApplication.setReferencePermission(true);
        jobApplication.setContactPermission(true);
        jobApplication.setOffers(new ArrayList<>());

        jobApplicationRepository.save(jobApplication);

    }

    public List<JobApplication> getJobApplicationsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }

        return jobApplicationRepository.findByCandidate((Candidate) user);
    }


    public ProfileDetails getProfileByUserId(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        return candidate.getProfileDetails();
    }

    public SocialLinks getSocialLinksByUserId(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        return candidate.getSocialLinks();
    }

    public ContactInformation getContactInformationByUserId(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        return candidate.getContactInformation();
    }

    public JobPreferences getJobPreferencesByUserId(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        return candidate.getJobPreferences();
    }


    public List<Candidate> getAvailableCandidates() {
        return candidateRepository.getAvailableCandidates();
    }
}
