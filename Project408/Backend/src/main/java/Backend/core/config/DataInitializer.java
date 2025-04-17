package Backend.core.config;

import Backend.core.enums.Gender;
import Backend.core.enums.Nationality;
import Backend.core.enums.UserType;
import Backend.core.location.Country;
import Backend.entities.company.Company;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.ProfileDetails;
import Backend.entities.user.employer.Employer;
import Backend.repository.CandidateRepository;
import Backend.repository.CountryRepository;
import Backend.repository.EmployerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CountryRepository countryRepository;
    private final EmployerRepository employerRepository;
    private final CandidateRepository candidateRepository;

    @Override
    public void run(String... args) {
        // Temporarily comment out all initialization to isolate issues
        System.out.println("🔍 Data initialization skipped for troubleshooting");
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
        // Create a test employer
        Employer employer = new Employer();
        employer.setEmail("mock@employer.com");
        employer.setPassword("password");
        employer.setUserType(UserType.EMPLOYER);
        employer.setFirstName("Mock");
        employer.setLastName("Employer");

        // Create a test company
        Company company = new Company();
        company.setCompanyName("Test Company");
        company.setEmail("company@test.com");
        company.setPhoneNumber("1234567890");
        company.setWebsiteUrl("https://testcompany.com");
        company.setEmployeeCount(50);
        company.setIndustry("Technology");
        
        // Initialize collections to avoid NullPointerException
        company.setEmployers(new ArrayList<>());
        company.setProjects(new ArrayList<>());
        company.setJobAdvs(new ArrayList<>());
        
        // Setup bidirectional relationship
        company.getEmployers().add(employer);
        employer.setCompany(company);

        // Save the employer (which will cascade to save the company)
        employerRepository.save(employer);

        System.out.println("✅ Test employer initialized");
    }
    
    private void initializeCandidate() {
        // Create a test candidate
        Candidate candidate = new Candidate();
        candidate.setEmail("mock@candidate.com");
        candidate.setPassword("password");
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