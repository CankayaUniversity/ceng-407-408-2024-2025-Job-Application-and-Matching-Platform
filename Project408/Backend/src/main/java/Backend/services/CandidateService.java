package Backend.services;

import Backend.core.enums.*;
import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.core.location.Department;
import Backend.core.location.University;
import Backend.entities.common.CustomJobPosition;
import Backend.entities.common.JobPositions;
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
import org.checkerframework.checker.units.qual.C;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.swing.text.Document;
import java.security.cert.Certificate;
import java.time.LocalDate;
import java.util.*;

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
    @Autowired
    CityRepository cityRepository;
    @Autowired
    private UniversityRepository universityRepository;


    @Transactional
    public Candidate updateProfile(String email, CandidateProfileDto dto) {
        // E-posta adresine göre kullanıcıyı bul
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        Candidate candidate = (Candidate) user;

        ProfileDetails profileDetails = candidate.getProfileDetails();
        if (profileDetails == null) {
            profileDetails = new ProfileDetails();
        }
        profileDetails.setAboutMe(dto.getAboutMe());
        profileDetails.setNationality(dto.getNationality());
        profileDetails.setGender(dto.getGender());
        profileDetails.setMilitaryStatus(dto.getMilitaryStatus());
        profileDetails.setMilitaryDefermentDate(dto.getMilitaryDefermentDate());
        profileDetails.setDisabilityStatus(dto.getDisabilityStatus());
        profileDetails.setMaritalStatus(dto.getMaritalStatus());
        profileDetails.setCurrentEmploymentStatus(dto.getCurrentEmploymentStatus());
        profileDetails.setDrivingLicense(dto.getDrivingLicense());
        profileDetails.setPrivateProfile(dto.getIsPrivateProfile());
//        profileDetails.setProfilePicture(dto.getProfilePicture());
        profileDetails.setBirthDate(dto.getBirthDate());
        candidate.setProfileDetails(profileDetails);


        SocialLinks socialLinks = candidate.getSocialLinks();
        if (socialLinks == null) {
            socialLinks = new SocialLinks();
        }
        socialLinks.setGithubUrl(dto.getGithubUrl());
        socialLinks.setLinkedinUrl(dto.getLinkedinUrl());
        socialLinks.setWebsiteUrl(dto.getWebsiteUrl());
        socialLinks.setBlogUrl(dto.getBlogUrl());
        socialLinks.setOtherLinksUrl(dto.getOtherLinksUrl());
        socialLinks.setOtherLinksDescription(dto.getOtherLinksDescription());
        candidate.setSocialLinks(socialLinks);

        ContactInformation contactInformation = candidate.getContactInformation();
        if (contactInformation == null) {
            contactInformation = new ContactInformation();
        }
        contactInformation.setPhoneNumber(dto.getPhoneNumber());

        if (dto.getCountry() != null) {
            countryRepository.findById(dto.getCountry())
                    .ifPresent(contactInformation::setCountry);
        }
        if (dto.getCity() != null) {
            cityRepository.findById(dto.getCity())
                    .ifPresent(contactInformation::setCity);
        }

        candidate.setContactInformation(contactInformation);

        JobPreferences jobPreferences = candidate.getJobPreferences();

        if(dto.getPreferredWorkType()!=null) {
            if (jobPreferences == null) {
                jobPreferences = new JobPreferences();
                candidate.setJobPreferences(jobPreferences);
            }

            if (candidate.getJobPreferences().getPreferredPositions() == null) {
                List<JobPositions> jobPositions = new ArrayList<>();
                List<JobPosition> jobPositionTypes = dto.getJobPositionTypes();
                List<CustomJobPosition> customJobPositionNames = dto.getCustomJobPositionNames();

                if (jobPositionTypes != null) {
                    for (int i = 0; i < jobPositionTypes.size(); i++) {
                        JobPositions jp = new JobPositions();
                        jp.setPositionType(jobPositionTypes.get(i));
                        if (customJobPositionNames != null && customJobPositionNames.size() > i) {
                            CustomJobPosition cjp = new CustomJobPosition();
                            cjp.setPositionName(String.valueOf(customJobPositionNames.get(i)));
                            jp.setCustomJobPosition(cjp);
                        }
                        jobPositions.add(jp);
                    }
                }

                jobPreferences.setPreferredPositions(jobPositions);

            } else {
                List<JobPositions> jobPositions = candidate.getJobPreferences().getPreferredPositions();
                jobPositions.clear();

                List<JobPosition> jobPositionTypes = dto.getJobPositionTypes();
                List<CustomJobPosition> customJobPositionNames = dto.getCustomJobPositionNames();

                if (jobPositionTypes != null) {
                    for (int i = 0; i < jobPositionTypes.size(); i++) {
                        JobPositions jp = new JobPositions();
                        jp.setPositionType(jobPositionTypes.get(i));
                        if (customJobPositionNames != null && customJobPositionNames.size() > i) {
                            CustomJobPosition cjp = new CustomJobPosition();
                            cjp.setPositionName(String.valueOf(customJobPositionNames.get(i)));
                            jp.setCustomJobPosition(cjp);
                        }
                        jobPositions.add(jp);
                    }
                }
                jobPreferences.setPreferredPositions(jobPositions);

            }

            jobPreferences.setPreferredWorkType(dto.getPreferredWorkType());

            if (dto.getMinWorkHour() != null) {
                jobPreferences.setMinWorkHour(dto.getMinWorkHour());
            }
            if (dto.getMaxWorkHour() != null) {
                jobPreferences.setMaxWorkHour(dto.getMaxWorkHour());
            }

            jobPreferences.setCanTravel(dto.getCanTravel());
            jobPreferences.setExpectedSalary(dto.getExpectedSalary());

            candidate.setJobPreferences(jobPreferences);
        }


        List<Reference> references;

        if(candidate.getReferences() == null) {
            references = new ArrayList<>();
            candidate.setReferences(references);
        } else {
            references = candidate.getReferences();
            references.clear();
        }
        List<String> referenceName = dto.getReferenceName();
        List<String> referenceCompany = dto.getReferenceCompany();
        List<String> referenceJobTitle = dto.getReferenceJobTitle();
        List<String> referenceContactInfo = dto.getReferenceContactInfo();
        List<Integer> referenceYearsWorked = dto.getReferenceYearsWorked();

        if(referenceName != null) {
            for(int i = 0; i < referenceName.size(); i++) {
                Reference ref = new Reference();

                ref.setReferenceName(referenceName.get(i));

                if(referenceJobTitle != null && referenceJobTitle.size() > i) {
                    ref.setReferenceJobTitle(referenceJobTitle.get(i));
                }
                if(referenceCompany != null && referenceCompany.size() > i) {
                    ref.setReferenceCompany(referenceCompany.get(i));
                }

                if(referenceContactInfo != null && referenceContactInfo.size() > i) {
                    ref.setReferenceContactInfo(referenceContactInfo.get(i));
                }

                if(referenceYearsWorked != null && referenceYearsWorked.size() > i) {
                    ref.setReferenceYearsWorked(String.valueOf(referenceYearsWorked.get(i)));
                }

                references.add(ref);
            }
        }
        candidate.setReferences(references);

        List<LanguageProficiency> languageProficiencies;

        if(candidate.getLanguageProficiency() == null) {
            languageProficiencies = new ArrayList<>();
            candidate.setLanguageProficiency(languageProficiencies);
        } else {
            languageProficiencies = candidate.getLanguageProficiency();
            languageProficiencies.clear();
        }

        List<String> languages = dto.getLanguageProficiencyLanguages();
        List<LanguageLevel> readingLevels = dto.getLanguageProficiencyReadingLevels();
        List<LanguageLevel> writingLevels = dto.getLanguageProficiencyWritingLevels();
        List<LanguageLevel> speakingLevels = dto.getLanguageProficiencySpeakingLevels();
        List<LanguageLevel> listeningLevels = dto.getLanguageProficiencyListeningLevels();

        if(languages != null) {
            for(int i = 0; i < languages.size(); i++) {
                LanguageProficiency lp = new LanguageProficiency();
                lp.setLanguage(languages.get(i));
                if(readingLevels != null && readingLevels.size() > i) lp.setReadingLevel(readingLevels.get(i));
                if(writingLevels != null && writingLevels.size() > i) lp.setWritingLevel(writingLevels.get(i));
                if(speakingLevels != null && speakingLevels.size() > i) lp.setSpeakingLevel(speakingLevels.get(i));
                if(listeningLevels != null && listeningLevels.size() > i) lp.setListeningLevel(listeningLevels.get(i));
                languageProficiencies.add(lp);
            }
        }
        candidate.setLanguageProficiency(languageProficiencies);
        List<Hobby> hobbies;

        if(candidate.getHobbies() == null) {
            hobbies = new ArrayList<>();
            candidate.setHobbies(hobbies);
        } else {
            hobbies = candidate.getHobbies();
            hobbies.clear();
        }

        List<String> hobbyNames = dto.getHobbyName();
        List<String> descriptions = dto.getDescription();

        if(hobbyNames != null) {
            for(int i = 0; i < hobbyNames.size(); i++) {
                Hobby hobby = new Hobby();
                hobby.setHobbyName(hobbyNames.get(i));
                if(descriptions != null && descriptions.size() > i) hobby.setDescription(descriptions.get(i));
                hobbies.add(hobby);
            }
        }
        candidate.setHobbies(hobbies);
        Education education;
        if (candidate.getEducation() == null) {
            education = new Education();
            candidate.setEducation(education);
        } else {
            education = candidate.getEducation();
        }

        education.setDegreeType(dto.getEducationDegreeType());

        University uni = universityRepository.findByName(dto.getAssociateUniversityName());
        if(uni!=null){
            Department department= candidate.getEducation().getAssociateDepartment();
            if(department == null) {
                department = new Department();
            }
            department.setName(dto.getAssociateDepartmentName());

            department.setUniversity(uni);
            education.setAssociateDepartment(department);

            education.setAssociateStartDate(dto.getAssociateStartDate());
            education.setAssociateEndDate(dto.getAssociateEndDate());
            education.setAssociateIsOngoing(dto.getAssociateIsOngoing());
        }

        University uni1 = universityRepository.findByName(dto.getBachelorUniversityName());

        if(uni1!=null){
            Department department1= candidate.getEducation().getBachelorDepartment();
            if(department1 == null) {
                department1 = new Department();
            }
            department1.setName(dto.getBachelorDepartmentName());
            department1.setUniversity(uni1);
            education.setBachelorDepartment(department1);

            education.setBachelorStartDate(dto.getBachelorStartDate());
            education.setBachelorEndDate(dto.getBachelorEndDate());
            education.setBachelorIsOngoing(dto.getBachelorIsOngoing());

        }


        University uni2 = universityRepository.findByName(dto.getMasterUniversityName());
        if(uni2!=null){
            Department department2= candidate.getEducation().getMasterDepartment();
            if(department2 == null) {
                department2 = new Department();
            }
            department2.setName(dto.getMasterDepartmentName());
            department2.setUniversity(uni2);
            education.setMasterDepartment(department2);

            education.setMasterStartDate(dto.getMasterStartDate());
            education.setMasterEndDate(dto.getMasterEndDate());
            education.setMasterIsOngoing(dto.getMasterIsOngoing());
            education.setMasterThesisTitle(dto.getMasterThesisTitle());
            education.setMasterThesisDescription(dto.getMasterThesisDescription());
            education.setMasterThesisUrl(dto.getMasterThesisUrl());
        }

        University uni3 = universityRepository.findByName(dto.getDoctorateUniversityName());
        if(uni3!=null){
            Department department3= candidate.getEducation().getDoctorateDepartment();
            if(department3 == null) {
                department3 = new Department();
            }
            department3.setName(dto.getDoctorateDepartmentName());
            department3.setUniversity(uni3);
            education.setDoctorateDepartment(department3);

            education.setDoctorateStartDate(dto.getDoctorateStartDate());
            education.setDoctorateEndDate(dto.getDoctorateEndDate());
            education.setDoctorateIsOngoing(dto.getDoctorateIsOngoing());
            education.setDoctorateThesisTitle(dto.getDoctorateThesisTitle());
            education.setDoctorateThesisDescription(dto.getDoctorateThesisDescription());
            education.setDoctorateThesisUrl(dto.getDoctorateThesisUrl());

        }

        University uni4 = universityRepository.findByName(dto.getDoubleMajorUniversityName());
        if(uni4!=null){
            Department department4= candidate.getEducation().getDoubleMajorDepartment();
            if(department4 == null) {
                department4 = new Department();
            }
            department4.setName(dto.getDoubleMajorDepartmentName());
            department4.setUniversity(uni4);
            education.setDoubleMajorDepartment(department4);

            education.setDoubleMajorStartDate(dto.getDoubleMajorStartDate());
            education.setDoubleMajorEndDate(dto.getDoubleMajorEndDate());
            education.setDoubleMajorIsOngoing(dto.getDoubleMajorIsOngoing());

            education.setDoubleMajor(dto.getIsMinor());
        }

        University uni5 = universityRepository.findByName(dto.getMinorUniversityName());
        if(uni5!=null){
            Department department5= candidate.getEducation().getMinorDepartment();

            if(department5 == null) {
                department5 = new Department();
            }
            department5.setName(dto.getMinorDepartmentName());
            department5.setUniversity(uni5);
            education.setMinorDepartment(department5);

            education.setMinorStartDate(dto.getMinorStartDate());
            education.setMinorEndDate(dto.getMinorEndDate());
            education.setMinorIsOngoing(dto.getMinorIsOngoing());
            education.setMinor(dto.getIsMinor());

        }

        candidate.setEducation(education);

        List<Certification> certifications;
        if(candidate.getCertifications() == null) {
            certifications = new ArrayList<>();
            candidate.setCertifications(certifications);
        }
        else{
            certifications = candidate.getCertifications();
            certifications.clear();
        }
        List<String> certificationName = dto.getCertificationName();
        List<String> certificationUrl = dto.getCertificationUrl();
        List<LocalDate> certificateValidityDate = dto.getCertificateValidityDate();
        List<String> issuedBy = dto.getIssuedBy();

        if(certificationName != null) {
            for(int i = 0; i < certificationName.size(); i++) {
                Certification certification = new Certification();
                certification.setCertificationName(certificationName.get(i));
                certification.setCertificationUrl(certificationUrl.get(i));
                certification.setCertificateValidityDate(certificateValidityDate.get(i));
                certification.setIssuedBy(issuedBy.get(i));
                certifications.add(certification);
            }
        }
        candidate.setCertifications(certifications);

        List<WorkExperience> workExperiences;
        if (candidate.getWorkExperiences() == null) {
            workExperiences = new ArrayList<>();
            candidate.setWorkExperiences(workExperiences);
        } else {
            workExperiences = candidate.getWorkExperiences();
            workExperiences.clear();
        }

        List<String> companyNames = dto.getCompanyName();
        List<String> industries = dto.getIndustry();
        List<String> jobTitles = dto.getJobTitle();
        List<String> jobDescriptions = dto.getJobDescription();
        List<EmploymentType> employmentTypes = dto.getEmploymentType();
        List<LocalDate> startDates = dto.getStartDate();
        List<LocalDate> endDates = dto.getEndDate();
        List<Boolean> isGoings = dto.getIsGoing();

        if (companyNames != null) {
            for (int i = 0; i < companyNames.size(); i++) {
                WorkExperience workExperience = new WorkExperience();
                workExperience.setCompanyName(companyNames.get(i));
                workExperience.setIndustry(industries != null && industries.size() > i ? industries.get(i) : null);
                workExperience.setJobTitle(jobTitles != null && jobTitles.size() > i ? jobTitles.get(i) : null);
                workExperience.setJobDescription(jobDescriptions != null && jobDescriptions.size() > i ? jobDescriptions.get(i) : null);
                workExperience.setEmploymentType(employmentTypes != null && employmentTypes.size() > i ? employmentTypes.get(i) : null);
                workExperience.setStartDate(startDates != null && startDates.size() > i ? startDates.get(i) : null);
                workExperience.setEndDate(endDates != null && endDates.size() > i ? endDates.get(i) : null);
                workExperience.setGoing(isGoings != null && isGoings.size() > i ? isGoings.get(i) : false);

                workExperiences.add(workExperience);
            }
        }

        candidate.setWorkExperiences(workExperiences);

        List<ExamAndAchievement> exams;
        if(candidate.getExamsAndAchievements() == null) {
            exams = new ArrayList<>();
            candidate.setExamsAndAchievements(exams);
        } else {
            exams = candidate.getExamsAndAchievements();
            exams.clear();
        }

        List<String> examNames = dto.getExamName();
        List<Integer> examYears = dto.getExamYear();
        List<Double> examScores = dto.getExamScore();
        List<String> examRanks = dto.getExamRank();

        if(examNames != null) {
            for(int i = 0; i < examNames.size(); i++) {
                ExamAndAchievement exam = new ExamAndAchievement();
                exam.setExamName(examNames.get(i));
                exam.setExamYear(examYears != null && examYears.size() > i ? examYears.get(i) : null);
                exam.setExamScore(examScores != null && examScores.size() > i ? examScores.get(i) : null);
                exam.setExamRank(examRanks != null && examRanks.size() > i ? examRanks.get(i) : null);
                exams.add(exam);
            }
        }
        candidate.setExamsAndAchievements(exams);

        List<UploadedDocument> documents;
        if(candidate.getUploadedDocuments() == null) {
            documents = new ArrayList<>();
            candidate.setUploadedDocuments(documents);
        } else {
            documents = candidate.getUploadedDocuments();
            documents.clear();
        }

        List<String> documentNames = dto.getDocumentName();
        List<String> documentTypes = dto.getDocumentType();
        List<DocumentCategory> documentCategories = dto.getDocumentCategory();
        List<String> documentUrls = dto.getDocumentUrl();
        List<Boolean> isPrivates = dto.getIsPrivate();

        if(documentNames != null) {
            for(int i = 0; i < documentNames.size(); i++) {
                UploadedDocument document = new UploadedDocument();
                document.setDocumentName(documentNames.get(i));
                document.setDocumentType(documentTypes != null && documentTypes.size() > i ? documentTypes.get(i) : null);
                document.setDocumentCategory(documentCategories != null && documentCategories.size() > i ? documentCategories.get(i) : null);
                document.setDocumentUrl(documentUrls != null && documentUrls.size() > i ? documentUrls.get(i) : null);
                document.setPrivate(isPrivates != null && isPrivates.size() > i ? isPrivates.get(i) : false);
                documents.add(document);
            }
        }
        candidate.setUploadedDocuments(documents);

        List<Skill> skills;
        if(candidate.getSkills() == null) {
            skills = new ArrayList<>();
            candidate.setSkills(skills);
        } else {
            skills = candidate.getSkills();
            skills.clear();
        }

        List<String> skillNames = dto.getSkillName();
        List<SkillLevel> skillLevels = dto.getSkillLevel();

        if(skillNames != null) {
            for(int i = 0; i < skillNames.size(); i++) {
                Skill skill = new Skill();
                skill.setSkillName(skillNames.get(i));
                skill.setSkillLevel(skillLevels != null && skillLevels.size() > i ? skillLevels.get(i) : null);
                skills.add(skill);
            }
        }
        candidate.setSkills(skills);

        List<Project> projects;
        if(candidate.getProjects() == null) {
            projects = new ArrayList<>();
            candidate.setProjects(projects);
        } else {
            projects = candidate.getProjects();
            projects.clear();
        }

        List<String> projectNames = dto.getProjectName();
        List<String> projectDescriptions = dto.getProjectDescription();
        List<LocalDate> projectStartDates = dto.getProjectStartDate();
        List<LocalDate> projectEndDates = dto.getProjectEndDate();
        List<ProjectStatus> projectStatuses = dto.getProjectStatus();
        List<Boolean> isPrivateProjects = dto.getIsPrivateProject();
        List<String> companies = dto.getCompany();

        if(projectNames != null) {
            for(int i = 0; i < projectNames.size(); i++) {
                Project project = new Project();
                project.setProjectName(projectNames.get(i));
                project.setProjectDescription(projectDescriptions != null && projectDescriptions.size() > i ? projectDescriptions.get(i) : null);
                project.setProjectStartDate(projectStartDates != null && projectStartDates.size() > i ? projectStartDates.get(i) : null);
                project.setProjectEndDate(projectEndDates != null && projectEndDates.size() > i ? projectEndDates.get(i) : null);
                project.setProjectStatus(projectStatuses != null && projectStatuses.size() > i ? projectStatuses.get(i) : null);
                project.setIsPrivate(isPrivateProjects != null && isPrivateProjects.size() > i ? isPrivateProjects.get(i) : false);
//                project.setCompany(companies != null && companies.size() > i ? companies.get(i) : null);
                projects.add(project);
            }
        }
        candidate.setProjects(projects);


        return candidateRepository.save(candidate);
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

    public List<Candidate> getCandidatesByActivityStatus(boolean active) {
        return candidateRepository.findAllByActivityStatus(active);
    }

    public CandidateProfileDto getProfile(Candidate candidate) {
        CandidateProfileDto dto = new CandidateProfileDto();

        // Profile Details
        dto.setAboutMe(candidate.getProfileDetails().getAboutMe());
        dto.setNationality(candidate.getProfileDetails().getNationality());
        dto.setGender(candidate.getProfileDetails().getGender());
        dto.setMilitaryStatus(candidate.getProfileDetails().getMilitaryStatus());
        dto.setMilitaryDefermentDate(candidate.getProfileDetails().getMilitaryDefermentDate());
        dto.setDisabilityStatus(candidate.getProfileDetails().getDisabilityStatus());
        dto.setMaritalStatus(candidate.getProfileDetails().getMaritalStatus());
        dto.setCurrentEmploymentStatus(candidate.getProfileDetails().isCurrentEmploymentStatus());
        dto.setDrivingLicense(candidate.getProfileDetails().isDrivingLicense());
        dto.setIsPrivateProfile(candidate.getProfileDetails().isPrivateProfile());
        dto.setProfilePicture(candidate.getProfileDetails().getProfilePicture());
        dto.setBirthDate(candidate.getProfileDetails().getBirthDate());

        // Social Links
        if (candidate.getSocialLinks() != null) {
            dto.setGithubUrl(candidate.getSocialLinks().getGithubUrl());
            dto.setLinkedinUrl(candidate.getSocialLinks().getLinkedinUrl());
            dto.setWebsiteUrl(candidate.getSocialLinks().getWebsiteUrl());
            dto.setBlogUrl(candidate.getSocialLinks().getBlogUrl());
            dto.setOtherLinksUrl(candidate.getSocialLinks().getOtherLinksUrl());
            dto.setOtherLinksDescription(candidate.getSocialLinks().getOtherLinksDescription());
        }

        // Contact Information
        if (candidate.getContactInformation() != null) {
            dto.setPhoneNumber(candidate.getContactInformation().getPhoneNumber());
            dto.setCountry(candidate.getContactInformation().getCountry().getId());
            dto.setCity(candidate.getContactInformation().getCity().getId());
        }

        // Job Preferences
        if (candidate.getJobPreferences() != null) {
            List<JobPosition> positionTypes = new ArrayList<>();
            List<CustomJobPosition> customJobPositions = new ArrayList<>();

            for (JobPositions j : candidate.getJobPreferences().getPreferredPositions()) {
                positionTypes.add(j.getPositionType());
                customJobPositions.add(j.getCustomJobPosition());
            }

            dto.setJobPositionTypes(positionTypes);
            dto.setCustomJobPositionNames(customJobPositions);

            dto.setPreferredWorkType(candidate.getJobPreferences().getPreferredWorkType());
            dto.setMinWorkHour(candidate.getJobPreferences().getMinWorkHour());
            dto.setMaxWorkHour(candidate.getJobPreferences().getMaxWorkHour());
            dto.setCanTravel(candidate.getJobPreferences().isCanTravel());
            dto.setExpectedSalary(candidate.getJobPreferences().getExpectedSalary());
        }

        // References (paralel listeler)
        List<Reference> references = candidate.getReferences();
        if (references != null && !references.isEmpty()) {
            List<String> referenceName = new ArrayList<>();
            List<String> referenceCompany = new ArrayList<>();
            List<String> referenceJobTitle = new ArrayList<>();
            List<String> referenceContactInfo = new ArrayList<>();
            List<Integer> referenceYearsWorked = new ArrayList<>();

            for (Reference r : references) {
                referenceName.add(r.getReferenceName());
                referenceCompany.add(r.getReferenceCompany());
                referenceJobTitle.add(r.getReferenceJobTitle());
                referenceContactInfo.add(r.getReferenceContactInfo());
                referenceYearsWorked.add(Integer.valueOf(r.getReferenceYearsWorked()));
            }
            dto.setReferenceName(referenceName);
            dto.setReferenceCompany(referenceCompany);
            dto.setReferenceJobTitle(referenceJobTitle);
            dto.setReferenceContactInfo(referenceContactInfo);
            dto.setReferenceYearsWorked(referenceYearsWorked);
        }

        // Language Proficiency
        List<LanguageProficiency> languages = candidate.getLanguageProficiency();
        if (languages != null && !languages.isEmpty()) {
            List<String> langs = new ArrayList<>();
            List<LanguageLevel> reading = new ArrayList<>();
            List<LanguageLevel> writing = new ArrayList<>();
            List<LanguageLevel> speaking = new ArrayList<>();
            List<LanguageLevel> listening = new ArrayList<>();

            for (LanguageProficiency lp : languages) {
                langs.add(lp.getLanguage());
                reading.add(lp.getReadingLevel());
                writing.add(lp.getWritingLevel());
                speaking.add(lp.getSpeakingLevel());
                listening.add(lp.getListeningLevel());
            }
            dto.setLanguageProficiencyLanguages(langs);
            dto.setLanguageProficiencyReadingLevels(reading);
            dto.setLanguageProficiencyWritingLevels(writing);
            dto.setLanguageProficiencySpeakingLevels(speaking);
            dto.setLanguageProficiencyListeningLevels(listening);
        }

        // Hobbies
        List<Hobby> hobbies = candidate.getHobbies();
        if (hobbies != null && !hobbies.isEmpty()) {
            List<String> hobbyNames = new ArrayList<>();
            List<String> descriptions = new ArrayList<>();

            for (Hobby h : hobbies) {
                hobbyNames.add(h.getHobbyName());
                descriptions.add(h.getDescription());
            }
            dto.setHobbyName(hobbyNames);
            dto.setDescription(descriptions);
        }

        // Education (örnek basit alanlar)
        Education education = candidate.getEducation();
        if (education != null) {
            dto.setEducationDegreeType(education.getDegreeType());
            if(education.getAssociateDepartment()!=null){
                dto.setAssociateDepartmentName(education.getAssociateDepartment().getName());
                dto.setAssociateUniversityName(education.getAssociateDepartment().getUniversity().getName());
                dto.setAssociateUniversityCityName(education.getAssociateDepartment().getUniversity().getCity().getName());
                dto.setAssociateStartDate(education.getAssociateStartDate());
                dto.setAssociateEndDate(education.getAssociateEndDate());
                dto.setAssociateIsOngoing(education.isAssociateIsOngoing());
            }

            if(education.getBachelorDepartment()!=null) {
                dto.setBachelorDepartmentName(education.getBachelorDepartment().getName());
                dto.setBachelorUniversityName(education.getBachelorDepartment().getUniversity().getName());
                dto.setBachelorUniversityCityName(education.getBachelorDepartment().getUniversity().getCity().getName());
                dto.setBachelorStartDate(education.getBachelorStartDate());
                dto.setBachelorEndDate(education.getBachelorEndDate());
                dto.setBachelorIsOngoing(education.isBachelorIsOngoing());
            }
            if(education.getMasterDepartment()!=null) {
                dto.setMasterDepartmentName(education.getMasterDepartment().getName());
                dto.setMasterUniversityName(education.getMasterDepartment().getUniversity().getName());
                dto.setMasterUniversityCityName(education.getMasterDepartment().getUniversity().getCity().getName());
                dto.setMasterStartDate(education.getMasterStartDate());
                dto.setMasterEndDate(education.getMasterEndDate());
                dto.setMasterIsOngoing(education.isMasterIsOngoing());
                dto.setMasterThesisTitle(education.getMasterThesisTitle());
                dto.setMasterThesisDescription(education.getMasterThesisDescription());
                dto.setMasterThesisUrl(education.getMasterThesisUrl());
            }


            if(education.getDoctorateDepartment()!=null) {
                dto.setDoctorateDepartmentName(education.getDoctorateDepartment().getName());
                dto.setDoctorateUniversityName(education.getDoctorateDepartment().getUniversity().getName());
                dto.setDoctorateUniversityCityName(education.getDoctorateDepartment().getUniversity().getCity().getName());
                dto.setDoctorateStartDate(education.getDoctorateStartDate());
                dto.setDoctorateEndDate(education.getDoctorateEndDate());
                dto.setDoctorateIsOngoing(education.isDoctorateIsOngoing());
                dto.setDoctorateThesisTitle(education.getDoctorateThesisTitle());
                dto.setDoctorateThesisDescription(education.getDoctorateThesisDescription());
                dto.setDoctorateThesisUrl(education.getDoctorateThesisUrl());
            }
            if(education.getDoubleMajorDepartment()!=null) {

                dto.setIsDoubleMajor(education.isDoubleMajor());
                dto.setDoubleMajorDepartmentName(education.getDoubleMajorDepartment().getName());
                dto.setDoubleMajorUniversityName(education.getDoubleMajorDepartment().getUniversity().getName());
                dto.setDoubleMajorUniversityCityName(education.getDoubleMajorDepartment().getUniversity().getCity().getName());
                dto.setDoubleMajorStartDate(education.getDoubleMajorStartDate());
                dto.setDoubleMajorEndDate(education.getDoubleMajorEndDate());
                dto.setDoubleMajorIsOngoing(education.isDoubleMajorIsOngoing());
            }
            if(education.getMinorDepartment()!=null) {

                dto.setIsMinor(education.isMinor());
                dto.setMinorDepartmentName(education.getMinorDepartment().getName());
                dto.setMinorUniversityName(education.getMinorDepartment().getUniversity().getName());
                dto.setMinorUniversityCityName(education.getMinorDepartment().getUniversity().getCity().getName());
                dto.setMinorStartDate(education.getMinorStartDate());
                dto.setMinorEndDate(education.getMinorEndDate());
                dto.setMinorIsOngoing(education.isMinorIsOngoing());
            }
        }

        List<Certification> certifications = candidate.getCertifications();
        if (certifications != null && !certifications.isEmpty()) {
            List<String> names = new ArrayList<>();
            List<String> urls = new ArrayList<>();
            List<LocalDate> validityDates = new ArrayList<>();
            List<String> issuedBys = new ArrayList<>();

            for (Certification c : certifications) {
                names.add(c.getCertificationName());
                urls.add(c.getCertificationUrl());
                validityDates.add(c.getCertificateValidityDate());
                issuedBys.add(c.getIssuedBy());
            }
            dto.setCertificationName(names);
            dto.setCertificationUrl(urls);
            dto.setCertificateValidityDate(validityDates);
            dto.setIssuedBy(issuedBys);
        }

        // Work Experiences (paralel listeler)
        List<WorkExperience> experiences = candidate.getWorkExperiences();
        if (experiences != null && !experiences.isEmpty()) {
            List<String> companyNames = new ArrayList<>();
            List<String> industries = new ArrayList<>();
            List<String> jobTitles = new ArrayList<>();
            List<String> jobDescriptions = new ArrayList<>();
            List<EmploymentType> employmentTypes = new ArrayList<>();
            List<LocalDate> startDates = new ArrayList<>();
            List<LocalDate> endDates = new ArrayList<>();
            List<Boolean> isGoingList = new ArrayList<>();

            for (WorkExperience w : experiences) {
                companyNames.add(w.getCompanyName());
                industries.add(w.getIndustry());
                jobTitles.add(w.getJobTitle());
                jobDescriptions.add(w.getJobDescription());
                employmentTypes.add(w.getEmploymentType());
                startDates.add(w.getStartDate());
                endDates.add(w.getEndDate());
                isGoingList.add(w.isGoing());
            }
            dto.setCompanyName(companyNames);
            dto.setIndustry(industries);
            dto.setJobTitle(jobTitles);
            dto.setJobDescription(jobDescriptions);
            dto.setEmploymentType(employmentTypes);
            dto.setStartDate(startDates);
            dto.setEndDate(endDates);
            dto.setIsGoing(isGoingList);
        }
        List<ExamAndAchievement> exams = candidate.getExamsAndAchievements();
        if (exams != null && !exams.isEmpty()) {
            List<String> examNames = new ArrayList<>();
            List<Integer> examYears = new ArrayList<>();
            List<Double> examScores = new ArrayList<>();
            List<String> examRanks = new ArrayList<>();

            for (ExamAndAchievement e : exams) {
                examNames.add(e.getExamName());
                examYears.add(e.getExamYear());
                examScores.add(e.getExamScore());
                examRanks.add(e.getExamRank());
            }

            dto.setExamName(examNames);
            dto.setExamYear(examYears);
            dto.setExamScore(examScores);
            dto.setExamRank(examRanks);
        }

        List<UploadedDocument> documents = candidate.getUploadedDocuments();
        if (documents != null && !documents.isEmpty()) {
            List<String> documentNames = new ArrayList<>();
            List<String> documentUrls = new ArrayList<>();
            List<String> documentTypes = new ArrayList<>();
            List<DocumentCategory> documentCategories = new ArrayList<>();
            List<Boolean> isPrivateList = new ArrayList<>();

            for (UploadedDocument d : documents) {
                documentNames.add(d.getDocumentName());
                documentUrls.add(d.getDocumentUrl());
                documentTypes.add(d.getDocumentType());
                documentCategories.add(d.getDocumentCategory());
                isPrivateList.add(d.isPrivate());
            }

            dto.setDocumentName(documentNames);
            dto.setDocumentUrl(documentUrls);
            dto.setDocumentType(documentTypes);
            dto.setDocumentCategory(documentCategories);
            dto.setIsPrivate(isPrivateList);
        }
        List<Skill> skills = candidate.getSkills();
        if (skills != null && !skills.isEmpty()) {
            List<String> skillNames = new ArrayList<>();
            List<SkillLevel> skillLevels = new ArrayList<>();

            for (Skill s : skills) {
                skillNames.add(s.getSkillName());
                skillLevels.add(s.getSkillLevel());
            }

            dto.setSkillName(skillNames);
            dto.setSkillLevel(skillLevels);
        }

        List<Project> projects = candidate.getProjects();
        if (projects != null && !projects.isEmpty()) {
            List<String> projectNames = new ArrayList<>();
            List<String> projectDescriptions = new ArrayList<>();
            List<LocalDate> projectStartDates = new ArrayList<>();
            List<LocalDate> projectEndDates = new ArrayList<>();
            List<ProjectStatus> projectStatuses = new ArrayList<>();
            List<Boolean> isProjectPrivateList = new ArrayList<>();
            List<String> companies = new ArrayList<>();

            for (Project p : projects) {
                projectNames.add(p.getProjectName());
                projectDescriptions.add(p.getProjectDescription());
                projectStartDates.add(p.getProjectStartDate());
                projectEndDates.add(p.getProjectEndDate());
                projectStatuses.add(p.getProjectStatus());
                isProjectPrivateList.add(p.getIsPrivate());
                if(p.getCompany()!=null){
                    companies.add(p.getCompany().getCompanyName());
                }
                else{
                    companies.add("Not Specified!");
                }

            }

            dto.setProjectName(projectNames);
            dto.setProjectDescription(projectDescriptions);
            dto.setProjectStartDate(projectStartDates);
            dto.setProjectEndDate(projectEndDates);
            dto.setProjectStatus(projectStatuses);
            dto.setIsPrivateProject(isProjectPrivateList);
            dto.setCompany(companies);
        }

        return dto;
    }



    public Map<String, Object> getProfileDetails(Candidate candidate) {

        Map<String, Object> flatMap = new HashMap<>();

        flatMap.put("profileDetails", candidate.getProfileDetails());
        flatMap.put("socialLinks", candidate.getSocialLinks());
        flatMap.put("contactInformation", candidate.getContactInformation());
        flatMap.put("jobPreferences", candidate.getJobPreferences());
        flatMap.put("references", candidate.getReferences());
        flatMap.put("languageProficiency", candidate.getLanguageProficiency());
        flatMap.put("hobbies", candidate.getHobbies());
        flatMap.put("education", candidate.getEducation());
        flatMap.put("certifications", candidate.getCertifications());
        flatMap.put("workExperiences", candidate.getWorkExperiences());
        flatMap.put("examsAndAchievements", candidate.getExamsAndAchievements());
        flatMap.put("uploadedDocuments", candidate.getUploadedDocuments());
        flatMap.put("skills", candidate.getSkills());
        flatMap.put("projects", candidate.getProjects());

        return flatMap;

    }


}
