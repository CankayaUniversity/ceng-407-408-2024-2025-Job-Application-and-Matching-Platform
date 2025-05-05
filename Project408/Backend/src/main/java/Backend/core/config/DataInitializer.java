package Backend.core.config;

import Backend.core.enums.*;
import Backend.core.location.Country;
import Backend.entities.common.JobPositions;
import Backend.entities.common.LanguageProficiency;
import Backend.entities.company.Company;
import Backend.entities.jobAdv.*;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobPreferences;
import Backend.entities.user.candidate.ProfileDetails;
import Backend.entities.user.employer.Employer;
import Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    @Autowired
    CountryRepository countryRepository;
    @Autowired
    EmployerRepository employerRepository;
    @Autowired
    CandidateRepository candidateRepository;
    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private JobAdvRepository jobAdvRepository;
    @Autowired
    private JobPreferencesRepository jobPreferencesRepository;
    @Autowired
    private JobPositionsRepository jobPositionsRepository;
    @Autowired
    private JobConditionRepository jobConditionRepository;
    @Autowired
    private BenefitRepository benefitRepository;
    @Autowired
    private JobQualificationRepository jobQualificationRepository;

    @Override
    public void run(String... args) {
        // Temporarily comment out all initialization to isolate issues
        System.out.println("🔍 Data initialization skipped for troubleshooting");

            initializeCountries();
            initializeEmployer();
            initializeCandidate();


    }

    private void initializeCountries() {
        Country turkey = new Country();
        turkey.setName("Turkey");
        turkey.setCities(new ArrayList<>());
        countryRepository.save(turkey);

        Country usa = new Country();
        usa.setName("United States");
        usa.setCities(new ArrayList<>());
        countryRepository.save(usa);

        Country germany = new Country();
        germany.setName("Germany");
        germany.setCities(new ArrayList<>());
        countryRepository.save(germany);

        System.out.println("✅ Countries initialized");
    }

    private void initializeEmployer() {
        // Create employer
        Employer employer = new Employer();
        employer.setEmail("e2@employer.com");
        employer.setPassword(passwordEncoder.encode("1"));
        employer.setUserType(UserType.EMPLOYER);
        employer.setFirstName("Mock");
        employer.setLastName("Employer");

        // Create company
        Company company = new Company();
        company.setCompanyName("Test Company");
        company.setEmail("company@test.com");
        company.setPhoneNumber("1234567890");
        company.setWebsiteUrl("https://testcompany.com");
        company.setEmployeeCount("50");
        company.setIndustry("Technology");

        company.setEmployers(new ArrayList<>());
        company.setProjects(new ArrayList<>());
        company.setJobAdvs(new ArrayList<>());
        company.getEmployers().add(employer);
        employer.setCompany(company);

        companyRepository.save(company);
        employerRepository.save(employer);

        Country country = countryRepository.findById(1).orElseThrow();

        // Create JobAdv first
        JobAdv jobAdv = new JobAdv();
        jobAdv.setDescription("Açıklama...");
        jobAdv.setLastDate(LocalDate.parse("2025-05-30"));
        jobAdv.setLicense(true);
        jobAdv.setMaxSalary(10000.0);
        jobAdv.setMinSalary(7000.0);
        jobAdv.setTravelRest(true);
        jobAdv.setCompany(company);
        jobAdv.setCreatedEmployer(employer);

        // Create JobCondition and JobQualification and set to jobAdv
        JobCondition jobCondition = new JobCondition();
        jobCondition.setEmploymentType(EmploymentType.FULL_TIME);
        jobCondition.setMaxWorkHours(40);
        jobCondition.setMinWorkHours(20);
        jobCondition.setWorkType(WorkType.REMOTE);
        jobCondition.setCountry(country);
        jobCondition.setJobAdv(jobAdv); // set the bidirectional relation

        JobQualification jobQualification = new JobQualification();
        jobQualification.setDegreeType(DegreeType.ASSOCIATE);
        jobQualification.setExperienceYears(3);
        jobQualification.setJobExperience(JobExperience.MID);
        jobQualification.setMilitaryStatus(MilitaryStatus.DEFERRED);
        jobQualification.setJobAdv(jobAdv); // set the bidirectional relation

        jobAdv.setJobCondition(jobCondition);
        jobAdv.setJobQualification(jobQualification);

        // Persist the whole object graph in one go
        jobAdvRepository.save(jobAdv);

        System.out.println("✅ Test employer initialized");
    }

    private void initializeCandidate() {
        // Create a test candidate
        Candidate candidate = new Candidate();
        candidate.setEmail("c2@candidate.com");
        candidate.setPassword(passwordEncoder.encode("1"));
        candidate.setUserType(UserType.CANDIDATE);
        candidate.setFirstName("Mock");
        candidate.setLastName("Candidate");

        // Create profile details
        ProfileDetails profileDetails = new ProfileDetails();
        profileDetails.setBirthDate(java.time.LocalDate.of(1990, 1, 1));
        profileDetails.setGender(Gender.MALE);
        // Comment out problematic field
        // profileDetails.setNationality(Nationality.TURKISH);
        profileDetails.setAboutMe("A test candidate for the platform");
        profileDetails.setPrivateProfile(false);
        profileDetails.setCurrentEmploymentStatus(false);
        profileDetails.setDrivingLicense(true);
        candidate.setProfileDetails(profileDetails);

        // Initialize lists to avoid NPE
        candidate.setReferences(new ArrayList<>());
        candidate.setLanguageProficiency(new ArrayList<>());
        candidate.setHobbies(new ArrayList<>());
        candidate.setCertifications(new ArrayList<>());
        candidate.setWorkExperiences(new ArrayList<>());
        candidate.setExamsAndAchievements(new ArrayList<>());
        candidate.setUploadedDocuments(new ArrayList<>());
        candidate.setSkills(new ArrayList<>());
        candidate.setProjects(new ArrayList<>());

        candidateRepository.save(candidate);


        System.out.println("✅ Test candidate initialized");
    }
} 