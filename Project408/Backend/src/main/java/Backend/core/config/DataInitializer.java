package Backend.core.config;

import Backend.core.enums.*;
import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.core.location.Department;
import Backend.core.location.University;
import Backend.entities.common.JobPositions;
import Backend.entities.common.LanguageProficiency;
import Backend.entities.common.Project;
import Backend.entities.company.Company;
import Backend.entities.jobAdv.*;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobApplication;
import Backend.entities.user.candidate.JobPreferences;
import Backend.entities.user.candidate.ProfileDetails;
import Backend.entities.user.candidate.Skill;
import Backend.entities.user.employer.Employer;
import Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

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
    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    private final Random random = new Random();

    @Override
    public void run(String... args) {
        if(employerRepository.count() == 0) {
            initializeCountries();
            initializeCities();
            initializeUniversities();
            initializeDepartments();
            initializeMockCompanies();
            initializeMockEmployers();
            initializeMockCandidates();
            initializeMockJobAdvs();
            initializeMockJobApplications();
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
                        "Ankara University", "Middle East Technical University",
                        "Hacettepe University", "Gazi University",
                        "Çankaya University", "Bilkent University",
                        "TOBB University of Economics and Technology",
                        "Yıldırım Beyazıt University", "Anadolu University",
                        "Başkent University"
                );
                for (String uniName : ankaraUniversities) {
                    University uni = new University();
                    uni.setName(uniName);
                    uni.setCity(city);
                    universitiesToSave.add(uni);
                }

            } else if (cityName.equalsIgnoreCase("Istanbul")) {
                List<String> istanbulUniversities = List.of(
                        "Istanbul University", "Bogazici University",
                        "Istanbul Technical University", "Marmara University",
                        "Yildiz Technical University", "Koc University",
                        "Sabanci University", "Istanbul Bilgi University",
                        "Istanbul Sehir University", "Istanbul Aydin University"
                );
                for (String uniName : istanbulUniversities) {
                    University uni = new University();
                    uni.setName(uniName);
                    uni.setCity(city);
                    universitiesToSave.add(uni);
                }

            } else if (cityName.equalsIgnoreCase("Izmir") || cityName.equalsIgnoreCase("İzmir")) {
                List<String> izmirUniversities = List.of(
                        "Ege University", "Dokuz Eylül University",
                        "Izmir Institute of Technology", "Izmir University of Economics",
                        "Yasar University", "Katip Celebi University"
                );
                for (String uniName : izmirUniversities) {
                    University uni = new University();
                    uni.setName(uniName);
                    uni.setCity(city);
                    universitiesToSave.add(uni);
                }

            } else if (cityName.equalsIgnoreCase("Antalya")) {
                List<String> antalyaUniversities = List.of(
                        "Akdeniz University", "Antalya Bilim University",
                        "Alanya Alaaddin Keykubat University", "Alanya HEP University"
                );
                for (String uniName : antalyaUniversities) {
                    University uni = new University();
                    uni.setName(uniName);
                    uni.setCity(city);
                    universitiesToSave.add(uni);
                }
            }
        }

        universityRepository.saveAll(universitiesToSave);
        System.out.println("✅ Universities initialized for Ankara, Istanbul, Izmir, and Antalya");
    }


    private void initializeDepartments() {
        // Türkiye'deki tüm şehirleri al (sadece Ankara ve İstanbul yerine istersen tüm şehirlerdeki üniversiteler için çalışır)
        Optional<Country> optionalTurkey = countryRepository.findByName("Turkey");
        if (optionalTurkey.isEmpty()) {
            System.out.println("❌ Turkey not found!");
            return;
        }

        Country turkey = optionalTurkey.get();
        List<City> citiesInTurkey = cityRepository.findByCountry(turkey);

        // Bu şehirlerdeki tüm üniversiteleri al
        List<University> universities = universityRepository.findByCityIn(citiesInTurkey);

        // Sadece bilgisayar mühendisliği ve benzeri alanlar
        List<String> departmentNames = List.of(
                "Computer Engineering",
                "Software Engineering",
                "Information Systems Engineering",
                "Artificial Intelligence Engineering",
                "Data Science",
                "Mechatronics Engineering",
                "Computer Science",
                "Cyber Security",
                "Electrical and Electronics Engineering"
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
        System.out.println("✅ Technology-related departments initialized for Turkish universities.");
    }

    private void initializeMockCompanies() {
        List<String> companyNames = Arrays.asList(
                "TechVision Solutions", "DataMind Analytics", "CloudWave Systems",
                "InnoTech Enterprises", "CyberGuard Security", "SmartCode Labs",
                "QuantumLeap Technologies", "ByteCraft Software", "NetworkPro Solutions",
                "AIMatrix Research"
        );

        List<String> industries = Arrays.asList(
                "Software Development", "Data Analytics", "Cloud Computing",
                "Cybersecurity", "Artificial Intelligence", "IoT",
                "Fintech", "E-commerce", "Healthcare Tech",
                "Enterprise Solutions"
        );

        for (int i = 0; i < companyNames.size(); i++) {
            Company company = new Company();
            company.setCompanyName(companyNames.get(i));
            company.setEmail("contact@" + companyNames.get(i).toLowerCase().replace(" ", "") + ".com");
            company.setPhoneNumber(String.format("+90 555 %03d %02d %02d", random.nextInt(1000), random.nextInt(100), random.nextInt(100)));
            company.setWebsiteUrl("https://www." + companyNames.get(i).toLowerCase().replace(" ", "") + ".com");
            company.setEmployeeCount(String.valueOf((random.nextInt(5) + 1) * 50));
            company.setIndustry(industries.get(i));
            company.setEmployers(new ArrayList<>());
            company.setProjects(new ArrayList<>());
            company.setJobAdvs(new ArrayList<>());

            companyRepository.save(company);
        }

        System.out.println("✅ Mock companies initialized");
    }

    private void initializeMockEmployers() {
        List<Company> companies = companyRepository.findAll();

        for (Company company : companies) {
            for (int i = 0; i < 2; i++) {
                Employer employer = new Employer();
                employer.setEmail("employer" + random.nextInt(1000) + "@" +
                        company.getCompanyName().toLowerCase().replace(" ", "") + ".com");
                employer.setPassword(passwordEncoder.encode("1"));
                employer.setUserType(UserType.EMPLOYER);
                employer.setFirstName(getRandomFirstName());
                employer.setLastName(getRandomLastName());
                employer.setCompany(company);
                employer.setEnabled(true);
                company.getEmployers().add(employer);
            }
            companyRepository.save(company);
        }


        System.out.println("✅ Mock employers initialized");
    }

    private void initializeMockCandidates() {
        List<University> universities = universityRepository.findAll();
        List<Department> departments = departmentRepository.findAll();

        for (int i = 0; i < 30; i++) {
            Candidate candidate = new Candidate();
            candidate.setEmail("candidate" + i + "@example.com");
            candidate.setPassword(passwordEncoder.encode("1"));
            candidate.setUserType(UserType.CANDIDATE);
            candidate.setFirstName(getRandomFirstName());
            candidate.setLastName(getRandomLastName());

            // Profile Details
            ProfileDetails profileDetails = new ProfileDetails();
            profileDetails.setBirthDate(LocalDate.now().minusYears(22 + random.nextInt(15)));
            profileDetails.setGender(random.nextBoolean() ? Gender.MALE : Gender.FEMALE);
            profileDetails.setAboutMe(generateRandomAboutMe());
            profileDetails.setPrivateProfile(false);
            profileDetails.setCurrentEmploymentStatus(random.nextBoolean());
            profileDetails.setDrivingLicense(random.nextBoolean());
            candidate.setProfileDetails(profileDetails);

            // Job Preferences
            JobPreferences jobPreferences = new JobPreferences();
            jobPreferences.setPreferredWorkType(getRandomWorkType());
            jobPreferences.setMinWorkHour(30 + random.nextInt(11));
            jobPreferences.setMaxWorkHour(40 + random.nextInt(11));
            jobPreferences.setCanTravel(random.nextBoolean());
            jobPreferences.setExpectedSalary(String.valueOf((random.nextInt(5) + 3) * 10000));
            candidate.setJobPreferences(jobPreferences);

            // Initialize collections
            candidate.setEnabled(true);

            candidate.setReferences(new ArrayList<>());
            candidate.setLanguageProficiency(generateRandomLanguageProficiencies());
            candidate.setHobbies(new ArrayList<>());
            candidate.setCertifications(new ArrayList<>());
            candidate.setWorkExperiences(new ArrayList<>());
            candidate.setExamsAndAchievements(new ArrayList<>());
            candidate.setUploadedDocuments(new ArrayList<>());
            candidate.setSkills(generateRandomSkills());
            candidate.setProjects(generateRandomProjects());

            candidateRepository.save(candidate);
        }

        System.out.println("✅ Mock candidates initialized");
    }

    private void initializeMockJobAdvs() {
        List<Company> companies = companyRepository.findAll();
        List<City> cities = cityRepository.findAll();
        Country turkey = countryRepository.findByName("Turkey").orElseThrow();

        for (Company company : companies) {
            List<Employer> employers = company.getEmployers();
            if (!employers.isEmpty()) {
                for (int i = 0; i < 3; i++) { // 3 job ads per company
                    JobAdv jobAdv = new JobAdv();
                    jobAdv.setDescription(generateRandomJobDescription());
                    jobAdv.setLastDate(LocalDate.now().plusMonths(random.nextInt(3) + 1));
                    jobAdv.setLicense(random.nextBoolean());
                    double minSalary = (random.nextInt(5) + 3) * 10000.0;
                    jobAdv.setMinSalary(minSalary);
                    jobAdv.setMaxSalary(minSalary + (random.nextInt(3) + 1) * 5000.0);
                    jobAdv.setTravelRest(random.nextBoolean());
                    jobAdv.setCompany(company);
                    jobAdv.setCreatedEmployer(employers.get(random.nextInt(employers.size())));

                    // Job Condition
                    JobCondition jobCondition = new JobCondition();
                    jobCondition.setEmploymentType(getRandomEmploymentType());
                    jobCondition.setMaxWorkHours(40 + random.nextInt(11));
                    jobCondition.setMinWorkHours(30 + random.nextInt(11));
                    jobCondition.setWorkType(getRandomWorkType());
                    jobCondition.setCountry(turkey);
                    jobCondition.setCity(cities.get(random.nextInt(cities.size())));
                    jobCondition.setJobAdv(jobAdv);

                    // Job Qualification
                    JobQualification jobQualification = new JobQualification();
                    jobQualification.setDegreeType(getRandomDegreeType());
                    jobQualification.setExperienceYears(random.nextInt(7));
                    jobQualification.setJobExperience(getRandomJobExperience());
                    jobQualification.setMilitaryStatus(getRandomMilitaryStatus());
                    jobQualification.setJobAdv(jobAdv);

                    jobAdv.setJobCondition(jobCondition);
                    jobAdv.setJobQualification(jobQualification);

                    jobAdvRepository.save(jobAdv);
                }
            }
        }

        System.out.println("✅ Mock job advertisements initialized");
    }

    private void initializeMockJobApplications() {
        List<Candidate> candidates = candidateRepository.findAll();
        List<JobAdv> jobAdvs = jobAdvRepository.findAll();

        for (Candidate candidate : candidates) {
            // Each candidate applies to 2-5 random jobs
            int numApplications = random.nextInt(4) + 2;
            List<JobAdv> availableJobs = new ArrayList<>(jobAdvs);
            Collections.shuffle(availableJobs);

            for (int i = 0; i < numApplications && i < availableJobs.size(); i++) {
                JobAdv jobAdv = availableJobs.get(i);

                // Create job application
                JobApplication application = new JobApplication();
                application.setCandidate(candidate);
                application.setJobAdv(jobAdv);
                application.setApplicationDate(LocalDate.now().minusDays(random.nextInt(30)));
                application.setStatus(getRandomApplicationStatus());
                application.setReferencePermission(random.nextBoolean());
                application.setContactPermission(random.nextBoolean());
                application.setCoverLetter(generateRandomCoverLetter(jobAdv));
                application.setOffers(new ArrayList<>());

                jobApplicationRepository.save(application);
            }
        }

        System.out.println("✅ Mock job applications initialized");
    }

    private ApplicationStatus getRandomApplicationStatus() {
        return ApplicationStatus.values()[random.nextInt(ApplicationStatus.values().length)];
    }

    private String generateRandomCoverLetter(JobAdv jobAdv) {
        List<String> templates = Arrays.asList(
                "Dear Hiring Manager,\n\nI am writing to express my strong interest in the %s position at %s. With my background in %s and %s, I believe I would be a valuable addition to your team. I am particularly drawn to your company's focus on %s.\n\nThank you for considering my application.\n\nBest regards",

                "Hello,\n\nI am excited to apply for the %s role at %s. My experience with %s and expertise in %s align perfectly with your requirements. I admire your company's commitment to %s and would love to contribute to your success.\n\nLooking forward to discussing this opportunity further.\n\nKind regards",

                "Dear Recruitment Team,\n\nI am thrilled to apply for the %s position at %s. Having worked extensively with %s and developed strong skills in %s, I am confident in my ability to contribute effectively. Your company's dedication to %s particularly resonates with me.\n\nThank you for your time and consideration.\n\nBest wishes"
        );

        List<String> skills = Arrays.asList(
                "software development", "web technologies", "cloud computing",
                "data analysis", "system architecture", "agile methodologies",
                "project management", "full-stack development", "DevOps practices"
        );

        List<String> companyStrengths = Arrays.asList(
                "innovation", "technological advancement", "customer satisfaction",
                "professional development", "industry leadership", "sustainable practices",
                "digital transformation", "employee growth", "quality excellence"
        );

        String template = templates.get(random.nextInt(templates.size()));
        List<String> shuffledSkills = new ArrayList<>(skills);
        Collections.shuffle(shuffledSkills);

        return String.format(template,
                jobAdv.getDescription().split(" ")[0] + " " + jobAdv.getDescription().split(" ")[1],
                jobAdv.getCompany().getCompanyName(),
                shuffledSkills.get(0),
                shuffledSkills.get(1),
                companyStrengths.get(random.nextInt(companyStrengths.size())));
    }

    // Helper methods for generating random data
    private String getRandomFirstName() {
        List<String> names = Arrays.asList(
                "Ahmet", "Mehmet", "Ali", "Ayşe", "Fatma", "Zeynep",
                "Can", "Deniz", "Ece", "Emre", "Gül", "Hakan",
                "İrem", "Kemal", "Leyla", "Murat", "Nur", "Ozan",
                "Pınar", "Serkan", "Selin", "Tolga", "Yeliz", "Yusuf"
        );
        return names.get(random.nextInt(names.size()));
    }

    private String getRandomLastName() {
        List<String> surnames = Arrays.asList(
                "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız",
                "Arslan", "Taş", "Aksoy", "Aydın", "Özdemir", "Doğan",
                "Kılıç", "Aslan", "Çetin", "Erdoğan", "Koç", "Kurt",
                "Özkan", "Şen", "Tekin", "Turan", "Yalçın", "Yüksel"
        );
        return surnames.get(random.nextInt(surnames.size()));
    }

    private String generateRandomAboutMe() {
        List<String> templates = Arrays.asList(
                "Experienced software developer with a passion for %s and %s. Skilled in %s development.",
                "Detail-oriented professional specializing in %s. Strong background in %s and %s.",
                "Creative problem-solver with expertise in %s. Passionate about %s and %s.",
                "Results-driven professional with focus on %s. Experience in %s and %s development."
        );

        List<String> skills = Arrays.asList(
                "web development", "mobile apps", "cloud computing",
                "machine learning", "data analysis", "cybersecurity",
                "UI/UX design", "DevOps", "backend development",
                "frontend development", "database management", "system architecture"
        );

        String template = templates.get(random.nextInt(templates.size()));
        List<String> shuffledSkills = new ArrayList<>(skills);
        Collections.shuffle(shuffledSkills);
        return String.format(template,
                shuffledSkills.get(0),
                shuffledSkills.get(1),
                shuffledSkills.get(2));
    }

    private List<LanguageProficiency> generateRandomLanguageProficiencies() {
        List<LanguageProficiency> proficiencies = new ArrayList<>();
        // Add Turkish as native
        LanguageProficiency turkish = new LanguageProficiency();
        turkish.setLanguage("Turkish");
        turkish.setReadingLevel(LanguageLevel.C1);
        turkish.setWritingLevel(LanguageLevel.C1);
        turkish.setSpeakingLevel(LanguageLevel.C1);
        turkish.setListeningLevel(LanguageLevel.C1);
        proficiencies.add(turkish);

        // Add English with random proficiency
        LanguageProficiency english = new LanguageProficiency();
        english.setLanguage("English");
        english.setReadingLevel(getRandomLanguageLevel());
        english.setWritingLevel(getRandomLanguageLevel());
        english.setSpeakingLevel(getRandomLanguageLevel());
        english.setListeningLevel(getRandomLanguageLevel());
        proficiencies.add(english);

        return proficiencies;
    }

    private List<Skill> generateRandomSkills() {
        List<Skill> skills = new ArrayList<>();
        List<String> technicalSkills = Arrays.asList(
                "Java", "Python", "JavaScript", "React", "Angular",
                "Node.js", "Spring Boot", "Docker", "Kubernetes", "AWS",
                "Git", "CI/CD", "MongoDB", "PostgreSQL", "Redis",
                "Machine Learning", "Data Analysis", "DevOps", "Microservices"
        );

        // Add 3-7 random skills
        int numSkills = random.nextInt(5) + 3;
        List<String> shuffledSkills = new ArrayList<>(technicalSkills);
        Collections.shuffle(shuffledSkills);

        for (int i = 0; i < numSkills; i++) {
            Skill skill = new Skill();
            skill.setSkillName(shuffledSkills.get(i));
            skill.setSkillLevel(getRandomSkillLevel());
            skills.add(skill);
        }

        return skills;
    }

    private List<Project> generateRandomProjects() {
        List<Project> projects = new ArrayList<>();
        List<String> projectNames = Arrays.asList(
                "E-commerce Platform", "Social Media Analytics", "Task Management System",
                "Healthcare Data Platform", "Smart Home Automation", "AI Chatbot",
                "Mobile Payment App", "Cloud Migration", "Security Dashboard",
                "IoT Monitoring System"
        );

        // Add 1-3 random projects
        int numProjects = random.nextInt(3) + 1;
        List<String> shuffledProjects = new ArrayList<>(projectNames);
        Collections.shuffle(shuffledProjects);

        for (int i = 0; i < numProjects; i++) {
            Project project = new Project();
            project.setProjectName(shuffledProjects.get(i));
            project.setProjectDescription(generateRandomProjectDescription(shuffledProjects.get(i)));

            // Set random dates within last 3 years
            LocalDate endDate = LocalDate.now().minusMonths(random.nextInt(36));
            LocalDate startDate = endDate.minusMonths(random.nextInt(12) + 3);
            project.setProjectStartDate(startDate);
            project.setProjectEndDate(endDate);

            project.setProjectStatus(getRandomProjectStatus());
            project.setIsPrivate(random.nextBoolean());

            projects.add(project);
        }

        return projects;
    }

    private String generateRandomProjectDescription(String projectName) {
        List<String> templates = Arrays.asList(
                "Developed a %s using %s and %s. Implemented features for %s.",
                "Led the development of %s, focusing on %s and %s. Achieved %s.",
                "Created a %s that utilized %s and %s for %s.",
                "Designed and implemented %s with %s, enabling %s through %s."
        );

        List<String> technologies = Arrays.asList(
                "React", "Node.js", "Spring Boot", "MongoDB",
                "AWS", "Docker", "Kubernetes", "PostgreSQL",
                "Redis", "GraphQL", "REST APIs", "Microservices"
        );

        List<String> achievements = Arrays.asList(
                "improved performance by 50%",
                "reduced operational costs",
                "increased user engagement",
                "enhanced security measures",
                "streamlined business processes",
                "optimized resource utilization"
        );

        String template = templates.get(random.nextInt(templates.size()));
        List<String> shuffledTech = new ArrayList<>(technologies);
        Collections.shuffle(shuffledTech);

        return String.format(template,
                projectName.toLowerCase(),
                shuffledTech.get(0),
                shuffledTech.get(1),
                achievements.get(random.nextInt(achievements.size())));
    }

    private LanguageLevel getRandomLanguageLevel() {
        return LanguageLevel.values()[random.nextInt(LanguageLevel.values().length)];
    }

    private SkillLevel getRandomSkillLevel() {
        return SkillLevel.values()[random.nextInt(SkillLevel.values().length)];
    }

    private ProjectStatus getRandomProjectStatus() {
        return ProjectStatus.values()[random.nextInt(ProjectStatus.values().length)];
    }

    private WorkType getRandomWorkType() {
        return WorkType.values()[random.nextInt(WorkType.values().length)];
    }

    private EmploymentType getRandomEmploymentType() {
        return EmploymentType.values()[random.nextInt(EmploymentType.values().length)];
    }

    private DegreeType getRandomDegreeType() {
        return DegreeType.values()[random.nextInt(DegreeType.values().length)];
    }

    private JobExperience getRandomJobExperience() {
        return JobExperience.values()[random.nextInt(JobExperience.values().length)];
    }

    private MilitaryStatus getRandomMilitaryStatus() {
        return MilitaryStatus.values()[random.nextInt(MilitaryStatus.values().length)];
    }

    private String generateRandomJobDescription() {
        List<String> templates = Arrays.asList(
                "We are seeking a talented %s to join our team. The ideal candidate will have experience in %s and %s.",
                "Looking for an experienced %s with strong skills in %s. Knowledge of %s is a plus.",
                "Join our growing team as a %s. Must have expertise in %s and familiarity with %s.",
                "Exciting opportunity for a %s to work on cutting-edge projects. Required skills: %s and %s."
        );

        List<String> positions = Arrays.asList(
                "Software Engineer", "Full Stack Developer", "Frontend Developer",
                "Backend Developer", "DevOps Engineer", "Data Scientist",
                "Machine Learning Engineer", "Cloud Architect", "Security Engineer",
                "Mobile Developer"
        );

        List<String> skills = Arrays.asList(
                "Java", "Python", "JavaScript", "React", "Angular",
                "Node.js", "AWS", "Docker", "Kubernetes", "TensorFlow",
                "Spring Boot", "MongoDB", "PostgreSQL", "CI/CD", "Git"
        );

        String template = templates.get(random.nextInt(templates.size()));
        String position = positions.get(random.nextInt(positions.size()));
        List<String> shuffledSkills = new ArrayList<>(skills);
        Collections.shuffle(shuffledSkills);

        return String.format(template, position, shuffledSkills.get(0), shuffledSkills.get(1));
    }
}