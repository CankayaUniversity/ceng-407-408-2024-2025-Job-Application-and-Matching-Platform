package Backend.core.config;

import Backend.core.enums.*;
import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.core.location.Department;
import Backend.core.location.University;
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
import java.util.List;
import java.util.Optional;

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
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private UniversityRepository universityRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Override
    public void run(String... args) {
        System.out.println("🔍 Data initialization skipped for troubleshooting");
        if(employerRepository.count() == 0) {
            initializeCountries();
            initializeEmployer();
            initializeCandidate();
            initializeCities();
            initializeUniversities();
            initializeDepartments();
        }

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
    private void initializeCities() {
        Optional<Country> optionalTurkey = countryRepository.findByName("Turkey");
        if (optionalTurkey.isEmpty()) {
            System.out.println("❌ Turkey not found while initializing cities");
            return;
        }

        Country turkey = optionalTurkey.get();

        List<String> cityNames = List.of(
                 "Ankara","İstanbul", "İzmir", "Bursa", "Adana",
                "Antalya", "Konya", "Gaziantep", "Kayseri", "Eskişehir",
                "Trabzon", "Diyarbakır", "Mersin", "Samsun", "Malatya",
                "Erzurum", "Sakarya", "Denizli", "Manisa", "Balıkesir"
        );

        List<City> cities = new ArrayList<>();
        for (String cityName : cityNames) {
            City city = new City();
            city.setName(cityName);
            city.setCountry(turkey);
            cities.add(city);
        }

        cityRepository.saveAll(cities);
        System.out.println("✅ 20 cities for Turkey initialized");
    }
    private void initializeUniversities() {
        Optional<Country> optionalTurkey = countryRepository.findByName("Turkey");
        if (optionalTurkey.isEmpty()) {
            System.out.println("❌ Turkey not found while initializing universities");
            return;
        }
        Country turkey = optionalTurkey.get();

        List<City> cities = cityRepository.findByCountry(turkey);

        List<University> universitiesToSave = new ArrayList<>();

        for (City city : cities) {
            String cityName = city.getName();

            if (cityName.equalsIgnoreCase("Ankara")) {
                List<String> ankaraUniversities = List.of(
                        "Ankara University",
                        "Middle East Technical University",
                        "Hacettepe University",
                        "Gazi University",
                        "Çankaya University",
                        "Bilkent University",
                        "TOBB University of Economics and Technology",
                        "Yıldırım Beyazıt University",
                        "Anadolu University",
                        "Başkent University"
                        // Dilersen daha ekleyebilirim
                );
                for (String uniName : ankaraUniversities) {
                    University uni = new University();
                    uni.setName(uniName);
                    uni.setCity(city);
                    universitiesToSave.add(uni);
                }
            } else if (cityName.equalsIgnoreCase("Istanbul")) {
                List<String> istanbulUniversities = List.of(
                        "Istanbul University",
                        "Bogazici University",
                        "Istanbul Technical University",
                        "Marmara University",
                        "Yildiz Technical University",
                        "Koc University",
                        "Sabanci University",
                        "Istanbul Bilgi University",
                        "Istanbul Sehir University",
                        "Istanbul Aydin University"
                        // Dilersen daha ekleyebilirim
                );
                for (String uniName : istanbulUniversities) {
                    University uni = new University();
                    uni.setName(uniName);
                    uni.setCity(city);
                    universitiesToSave.add(uni);
                }
            }
            // Diğer şehirler için istersen ekleyebilirim
        }

        universityRepository.saveAll(universitiesToSave);
        System.out.println("✅ Realistic universities initialized for Ankara and Istanbul");
    }

    private void initializeDepartments() {
        // Ankara ve İstanbul şehirlerini bul
        City ankara = cityRepository.findByName("Ankara");
        City istanbul = cityRepository.findByName("İstanbul");

        if (ankara == null || istanbul == null) {
            System.out.println("❌ Ankara veya İstanbul bulunamadı!");
            return;
        }

        // Bu şehirlerdeki üniversiteleri getir
        List<University> universities = universityRepository.findByCityIn(List.of(ankara, istanbul));

        List<String> departmentNames = List.of(
                "Computer Engineering",
                "Software Engineering",
                "Electrical Engineering",
                "Information Systems",
                "Mechatronics Engineering"
        );

        List<Department> departmentsToSave = new ArrayList<>();

        for (University uni : universities) {
            for (String deptName : departmentNames) {
                Department dept = new Department();
                dept.setName(deptName);
                dept.setUniversity(uni);
                departmentsToSave.add(dept);
            }
        }

        departmentRepository.saveAll(departmentsToSave);
        System.out.println("✅ Departments created for Ankara and İstanbul universities.");
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