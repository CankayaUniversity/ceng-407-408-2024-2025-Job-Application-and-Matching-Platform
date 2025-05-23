package Backend.services;

import Backend.core.enums.*;
import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.entities.common.CustomJobPosition;
import Backend.entities.dto.InterviewDto;
import Backend.entities.dto.JobAdvCreateDto;
import Backend.entities.dto.JobAdvDto;
import Backend.entities.jobAdv.*;
import Backend.entities.offer.Interviews;
import Backend.entities.offer.JobOffer;
import Backend.entities.company.Company;
import Backend.entities.user.User;
import Backend.entities.user.candidate.JobApplication;
import Backend.entities.common.JobPositions;
import Backend.entities.common.LanguageProficiency;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.ProfileDetails;
import Backend.entities.user.candidate.WorkExperience;
import Backend.entities.user.employer.Employer;
import Backend.repository.*;
import Backend.request.jobAdv.JobAdvCreateRequest;
import Backend.request.jobAdv.JobAdvUpdateRequest;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor

public class JobAdvService {
    @Autowired
    JobAdvRepository jobAdvRepository;
    @Autowired
    EmployerRepository employerRepository;
    @Autowired

    CountryRepository countryRepository;
    @Autowired

    JobPositionsRepository jobPositionsRepository;
    @Autowired

    LanguageProficiencyRepository languageProficiencyRepository;
    @Autowired

    CandidateRepository candidateRepository;
    @Autowired

   JobApplicationRepository jobApplicationRepository;
    @Autowired

    JobOfferRepository jobOfferRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private JobConditionRepository jobConditionRepository;
    @Autowired
    private BenefitRepository benefitRepository;
    @Autowired
    private InterviewRepository interviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService notificationService;

    // Helper method to convert JobAdv to JobAdvDto - DRY principle
    private JobAdvDto convertJobAdvToDto(JobAdv jobAdv) {
        if (jobAdv == null || jobAdv.getCompany() == null) { // Basic null check
            return null;
        }
        JobAdvDto dto = new JobAdvDto();
        dto.setId(jobAdv.getId());
        dto.setDescription(jobAdv.getDescription());
        dto.setCompanyName(jobAdv.getCompany().getCompanyName()); // Assuming company is not null
        dto.setMinSalary(jobAdv.getMinSalary());
        dto.setMaxSalary(jobAdv.getMaxSalary());
        dto.setLastDate(jobAdv.getLastDate());
        dto.setTravelRest(jobAdv.isTravelRest());
        dto.setLicense(jobAdv.isLicense());
        dto.setActive(jobAdv.isActive()); // Added active status to DTO

        if (jobAdv.getJobCondition() != null) {
            JobCondition jobCondition = jobAdv.getJobCondition();
            dto.setWorkType(jobCondition.getWorkType());
            dto.setEmploymentType(jobCondition.getEmploymentType());
            if (jobCondition.getCountry() != null) {
                dto.setCountry(jobCondition.getCountry().getName());
            }
            if (jobCondition.getCity() != null) {
                dto.setCity(jobCondition.getCity().getName());
            }
            dto.setMinWorkHours(jobCondition.getMinWorkHours());
            dto.setMaxWorkHours(jobCondition.getMaxWorkHours());
        }

        if (jobAdv.getJobQualification() != null) {
            JobQualification jobQualification = jobAdv.getJobQualification();
            if (jobQualification.getDegreeType() != null) {
                 dto.setDegreeType(jobQualification.getDegreeType().toString());
            }
            if (jobQualification.getJobExperience() != null) {
                dto.setJobExperience(jobQualification.getJobExperience().toString());
            }
            dto.setExperienceYears(jobQualification.getExperienceYears());
             if (jobQualification.getMilitaryStatus() != null) {
                dto.setMilitaryStatus(jobQualification.getMilitaryStatus().toString());
            }
            if (jobQualification.getTechnicalSkills() != null) {
                dto.setTechnicalSkills(jobQualification.getTechnicalSkills().stream()
                    .map(skill -> {
                        TechnicalSkill tech = new TechnicalSkill();
                        tech.setPositionName(skill.getPositionName());
                        tech.setSkillLevel(skill.getSkillLevel());
                        tech.setDescription(skill.getDescription());
                        return tech;
                    })
                    .collect(Collectors.toList()));
            }
            if (jobQualification.getSocialSkills() != null) {
                dto.setSocialSkills(jobQualification.getSocialSkills().stream()
                    .map(skill -> {
                        SocialSkill social = new SocialSkill(); // Corrected variable name
                        social.setPositionName(skill.getPositionName());
                        social.setSkillLevel(skill.getSkillLevel());
                        social.setDescription(skill.getDescription());
                        return social;
                    })
                    .collect(Collectors.toList()));
            }
            if (jobQualification.getLanguageProficiencies() != null) {
                 dto.setLanguageProficiencies(jobQualification.getLanguageProficiencies().stream()
                    .map(lang -> {
                        LanguageProficiency langDto = new LanguageProficiency();
                        langDto.setLanguage(lang.getLanguage());
                        langDto.setReadingLevel(lang.getReadingLevel());
                        langDto.setWritingLevel(lang.getWritingLevel());
                        langDto.setSpeakingLevel(lang.getSpeakingLevel());
                        langDto.setListeningLevel(lang.getListeningLevel());
                        return langDto;
                    })
                    .collect(Collectors.toList()));
            }
        }

        if (jobAdv.getBenefits() != null) {
            dto.setBenefitTypes(jobAdv.getBenefits().stream()
                .map(benefit -> {
                    Benefit b = new Benefit();
                    b.setBenefitType(benefit.getBenefitType());
                    b.setDescription(benefit.getDescription());
                    return b;
                })
                .collect(Collectors.toList()));
        }

        if (jobAdv.getJobPositions() != null) {
            dto.setJobPositions(jobAdv.getJobPositions().stream()
                .map(position -> {
                    JobPositions positions = new JobPositions();
                    positions.setPositionType(position.getPositionType());
                    positions.setCustomJobPosition(position.getCustomJobPosition());
                    return positions;
                })
                .collect(Collectors.toList()));
        }
        return dto;
    }

    public void createJobAdv(JobAdvCreateDto request, String employerEmail) {
    Employer employer = employerRepository.findByEmail(employerEmail)
            .orElseThrow(() -> new RuntimeException("Employer does not found! " + employerEmail));

    Company company = companyRepository.findById(request.getCompanyId()).orElseThrow(()-> new RuntimeException("Company does not exist!."));

    JobAdv jobAdv = new JobAdv();
    jobAdv.setCompany(company);
    jobAdv.setDescription(request.getDescription());
    jobAdv.setMaxSalary(request.getMaxSalary());
    jobAdv.setMinSalary(request.getMinSalary());
    jobAdv.setLastDate(request.getLastDate());
    jobAdv.setTravelRest(request.getTravelRest());
    jobAdv.setLicense(request.getLicense());
    jobAdv.setCreatedEmployer(employer);

    if(request.getJobConditionWorkType() != null && request.getJobConditionEmploymentType() != null) {
        JobCondition jobCondition = new JobCondition();
        jobCondition.setWorkType(request.getJobConditionWorkType());
        jobCondition.setEmploymentType(request.getJobConditionEmploymentType());

        if(request.getJobConditionCountry() != null) {
            Country country = countryRepository.findById(request.getJobConditionCountry()).orElseThrow(()->new RuntimeException("Country bulunamadı."));
            jobCondition.setCountry(country);
        }
        if(request.getJobConditionCity() != null) {
            City city = cityRepository.findById(request.getJobConditionCity()).orElseThrow(()->new RuntimeException("City bulunamadi"));
            jobCondition.setCity(city);
        }
        jobCondition.setMaxWorkHours(request.getJobConditionMaxWorkHours());
        jobCondition.setMinWorkHours(request.getJobConditionMinWorkHours());

        jobCondition.setJobAdv(jobAdv);
        jobAdv.setJobCondition(jobCondition);

    }

    if(request.getJobQualificationJobExperience() != null && request.getJobQualificationDegreeType() != null) {
        JobQualification jobQualification = new JobQualification();
        jobQualification.setDegreeType(request.getJobQualificationDegreeType());
        jobQualification.setJobExperience(request.getJobQualificationJobExperience());
        jobQualification.setExperienceYears(request.getJobQualificationExperienceYears());
        jobQualification.setMilitaryStatus(request.getJobQualificationMilitaryStatus());


        List<TechnicalSkill> technicalSkills = new ArrayList<>();
        List<String> tsPositionNames = request.getTechnicalSkillPositionNames();
        List<SkillLevel> tsLevels = request.getTechnicalSkillLevels();
        List<String> tsDescriptions = request.getTechnicalSkillDescriptions();

        if (tsPositionNames != null) {
            for (int i = 0; i < tsPositionNames.size(); i++) {
                TechnicalSkill ts = new TechnicalSkill();
                ts.setPositionName(tsPositionNames.get(i));
                if (tsLevels != null && tsLevels.size() > i)
                    ts.setSkillLevel(tsLevels.get(i));
                if (tsDescriptions != null && tsDescriptions.size() > i)
                    ts.setDescription(tsDescriptions.get(i));
                ts.setJobQualification(jobQualification);
                technicalSkills.add(ts);
            }
        }
        jobQualification.setTechnicalSkills(technicalSkills);

        List<SocialSkill> socialSkills = new ArrayList<>();
        List<String> ssPositionNames = request.getSocialSkillPositionNames();
        List<SkillLevel> ssLevels = request.getSocialSkillLevels();
        List<String> ssDescriptions = request.getSocialSkillDescriptions();

        if (ssPositionNames != null) {
            for (int i = 0; i < ssPositionNames.size(); i++) {
                SocialSkill ss = new SocialSkill();
                ss.setPositionName(ssPositionNames.get(i));
                if (ssLevels != null && ssLevels.size() > i)
                    ss.setSkillLevel(ssLevels.get(i));
                if (ssDescriptions != null && ssDescriptions.size() > i)
                    ss.setDescription(ssDescriptions.get(i));
                ss.setJobQualification(jobQualification);
                socialSkills.add(ss);
            }
        }
        jobQualification.setSocialSkills(socialSkills);

        List<LanguageProficiency> languageProficiencies = new ArrayList<>();
        List<String> lpLanguages = request.getLanguageProficiencyLanguages();
        List<LanguageLevel> lpReading = request.getLanguageProficiencyReadingLevels();
        List<LanguageLevel> lpWriting = request.getLanguageProficiencyWritingLevels();
        List<LanguageLevel> lpSpeaking = request.getLanguageProficiencySpeakingLevels();
        List<LanguageLevel> lpListening = request.getLanguageProficiencyListeningLevels();

        if (lpLanguages != null) {
            for (int i = 0; i < lpLanguages.size(); i++) {
                LanguageProficiency lp = new LanguageProficiency();
                lp.setLanguage(lpLanguages.get(i));
                if (lpReading != null && lpReading.size() > i)
                    lp.setReadingLevel(lpReading.get(i));
                if (lpWriting != null && lpWriting.size() > i)
                    lp.setWritingLevel(lpWriting.get(i));
                if (lpSpeaking != null && lpSpeaking.size() > i)
                    lp.setSpeakingLevel(lpSpeaking.get(i));
                if (lpListening != null && lpListening.size() > i)
                    lp.setListeningLevel(lpListening.get(i));
                languageProficiencies.add(lp);
            }
        }
        jobQualification.setLanguageProficiencies(languageProficiencies);
        jobQualification.setJobAdv(jobAdv);
        jobAdv.setJobQualification(jobQualification);

    }
        List<Benefit> benefits = new ArrayList<>();
        List<BenefitType> benefitTypes = request.getBenefitTypes();
        List<String> benefitDescriptions = request.getBenefitDescriptions();

        if (benefitTypes != null) {
            for (int i = 0; i < benefitTypes.size(); i++) {
                if(benefitTypes.get(i) !=null){
                    Benefit benefit = new Benefit();
                    benefit.setBenefitType(benefitTypes.get(i));
                    if (benefitDescriptions != null && benefitDescriptions.size() > i)
                        benefit.setDescription(benefitDescriptions.get(i));
                    benefits.add(benefit);
                }
                else{
                    System.out.println("Warning: benefitTypes listesinde null eleman bulundu, atlandı.");
                }

            }
        }

        List<JobPositions> jobPositions = new ArrayList<>();
        List<JobPosition> jobPositionTypes = request.getJobPositionTypes();
        List<String> customJobPositionNames = request.getCustomJobPositionNames();

        if (jobPositionTypes != null) {
            for (int i = 0; i < jobPositionTypes.size(); i++) {
                if(jobPositionTypes.get(i) !=null){
                    JobPositions jp = new JobPositions();
                    jp.setPositionType(jobPositionTypes.get(i));
                    if (customJobPositionNames != null && customJobPositionNames.size() > i) {
                        CustomJobPosition cjp = new CustomJobPosition();
                        cjp.setPositionName(customJobPositionNames.get(i));
                        jp.setCustomJobPosition(cjp);
                    }
                    jobPositions.add(jp);
                }
                else{
                    System.out.println("Warning: jobpositions listesinde null eleman bulundu, atlandı.");

                }

            }
        }

        if(!benefits.isEmpty()){
            for(Benefit  b: benefits ){
                b.setJobAdv(jobAdv);
            }
            jobAdv.setBenefits(benefits);
        }

        if(!jobPositions.isEmpty()){
            for(JobPositions j : jobPositions ){
                j.setJobAdv(jobAdv);
            }
            jobAdv.setJobPositions(jobPositions);

        }

        jobAdvRepository.save(jobAdv);

    }

// Yeni: JWT email ile update
public void updateJobAdv(int jobAdvId, String userEmail, JobAdvUpdateRequest request) {
    JobAdv jobAdv = jobAdvRepository.findById(jobAdvId)
            .orElseThrow(() -> new RuntimeException("İlan bulunamadı."));

    Employer employer = employerRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));

    Integer jobCompanyId = jobAdv.getCompany() != null ? jobAdv.getCompany().getId() : null;
    Integer employerCompanyId = employer.getCompany() != null ? employer.getCompany().getId() : null;

    if (jobCompanyId == null || employerCompanyId == null || !jobCompanyId.equals(employerCompanyId)) {
        throw new RuntimeException("Bu ilana erişim yetkiniz yok.");
    }

    // Güncelleme işlemi
    jobAdv.setDescription(request.getDescription());
    jobAdv.setMinSalary(request.getMinSalary());
    jobAdv.setMaxSalary(request.getMaxSalary());
    jobAdv.setLastDate(request.getDeadline());
    jobAdv.setTravelRest(request.isTravelRest());
    jobAdv.setLicense(request.isLicense());

    jobAdvRepository.save(jobAdv);
    System.out.println("✅ İlan başarıyla güncellendi. ID: " + jobAdvId);
}
    @Transactional
    public void deleteJobAdv(int jobAdvId, String userEmail) {
        JobAdv jobAdv = jobAdvRepository.findById(jobAdvId)
                .orElseThrow(() -> new RuntimeException("Silinecek ilan bulunamadı."));

        Employer employer = employerRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));

        Integer jobCompanyId = jobAdv.getCompany() != null ? jobAdv.getCompany().getId() : null;
        Integer employerCompanyId = employer.getCompany() != null ? employer.getCompany().getId() : null;

        if (jobCompanyId == null || employerCompanyId == null || !jobCompanyId.equals(employerCompanyId)) {
            throw new RuntimeException("Bu ilana erişim yetkiniz yok.");
        }
        jobAdv.setActive(false);
        jobAdvRepository.save(jobAdv);

//        jobAdvRepository.delete(jobAdv);

        System.out.println("JobAdv ve ilişkili kayıtlar silindi.");
    }



// Updated method to accept Employer object and filter parameters
public List<JobAdvDto> getMyJobAdvs(Employer employer, String positionName, String status, String workTypeStr) {
    if (employer == null || employer.getCompany() == null) {
        // Or throw an IllegalArgumentException
        throw new RuntimeException("İşveren veya şirket bilgisi eksik.");
    }

    Company employerCompany = employer.getCompany();
    List<JobAdv> jobAdvsForCompany = jobAdvRepository.findByCompanyId(employerCompany.getId());

    // Apply filters programmatically
    Stream<JobAdv> filteredStream = jobAdvsForCompany.stream();

    // Status filter (ACTIVE, EXPIRED, ALL)
    if (status != null && !status.equalsIgnoreCase("ALL")) {
        final boolean targetActiveState = status.equalsIgnoreCase("ACTIVE");
        filteredStream = filteredStream.filter(jobAdv -> {
            boolean isCurrentlyActive = jobAdv.isActive() && (jobAdv.getLastDate() == null || jobAdv.getLastDate().isAfter(LocalDate.now().minusDays(1)));
            return isCurrentlyActive == targetActiveState;
        });
    } else {
        // Default to showing only active jobs if no specific status or "ALL" is given and job is marked active by employer
        // If you want truly all (including manually deactivated), this logic might need adjustment
        // For now, respecting jobAdv.isActive() as a primary flag from employer
         filteredStream = filteredStream.filter(JobAdv::isActive); 
    }

    // Position name filter (case-insensitive, searches in job position types and custom names)
    if (positionName != null && !positionName.isEmpty()) {
        String lowerPositionName = positionName.toLowerCase();
        filteredStream = filteredStream.filter(jobAdv -> 
            jobAdv.getJobPositions() != null && jobAdv.getJobPositions().stream().anyMatch(jp -> 
                (jp.getPositionType() != null && jp.getPositionType().name().toLowerCase().contains(lowerPositionName)) ||
                (jp.getCustomJobPosition() != null && jp.getCustomJobPosition().getPositionName() != null && jp.getCustomJobPosition().getPositionName().toLowerCase().contains(lowerPositionName))
            )
        );
    }

    // Work type filter
    if (workTypeStr != null && !workTypeStr.isEmpty()) {
        try {
            WorkType filterWorkType = WorkType.valueOf(workTypeStr.toUpperCase());
            filteredStream = filteredStream.filter(jobAdv -> 
                jobAdv.getJobCondition() != null && jobAdv.getJobCondition().getWorkType() == filterWorkType
            );
        } catch (IllegalArgumentException e) {
            // Log invalid work type string, or ignore, or throw error
            System.err.println("Invalid work type for filtering: " + workTypeStr);
        }
    }

    return filteredStream
            .map(this::convertJobAdvToDto) // Use the helper method
            .filter(Objects::nonNull) // Ensure no null DTOs if conversion fails
            .collect(Collectors.toList());
}



// 🔸 YENİ: İlana başvurma metodu
public void applyForJob(int jobAdvId, String candidateEmail) {
    JobAdv jobAdv = jobAdvRepository.findById(jobAdvId)
            .orElseThrow(() -> new RuntimeException("İlan bulunamadı."));

    Candidate candidate = candidateRepository.findByEmail(candidateEmail)
            .orElseThrow(() -> new RuntimeException("Aday bulunamadı."));

    // Aynı ilana birden fazla başvuru kontrolü
    if (jobApplicationRepository.existsByCandidateAndJobAdv(candidate, jobAdv)) {
        throw new RuntimeException("Bu ilana zaten başvurdunuz.");
    }
    
    JobApplication application = new JobApplication();
    application.setCandidate(candidate);
    application.setJobAdv(jobAdv);
    application.setApplicationDate(LocalDate.now());
    application.setStatus(ApplicationStatus.PENDING);
    application.setReferencePermission(true);  // test için true
    application.setContactPermission(true);    // test için true
    application.setOffers(new ArrayList<>());  // Initialize offers list

    jobApplicationRepository.save(application);
    System.out.println("✅ Aday başvurusu başarıyla kaydedildi: " + candidate.getUsername());

    // Notify employer
    Employer employer = jobAdv.getCreatedEmployer();
    if (employer != null) {
        String message = candidate.getFirstName() + " " + candidate.getLastName() + " applied to your job posting: " + jobAdv.getJobPositions().stream().map(jp -> jp.getPositionType().name()).collect(Collectors.joining(", "));
        // Link to the applications page for this job, or a general applications page
        String link = "/employer/job-advs/" + jobAdv.getId() + "/applications"; // Example link
        notificationService.notifyUser(employer, message, link);
    }
}


public List<String> getApplicationsForJobAdv(int jobAdvId, String userEmail) {
    // 1. Employer'ı email ile bul
    Employer employer = employerRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));

    Company employerCompany = employer.getCompany();
    if (employerCompany == null) {
        throw new RuntimeException("İşverene ait şirket bilgisi eksik.");
    }

    // 2. İlanı veritabanından al
    JobAdv jobAdv = jobAdvRepository.findById(jobAdvId)
            .orElseThrow(() -> new RuntimeException("İlan bulunamadı."));

    Company jobCompany = jobAdv.getCompany();
    if (jobCompany == null) {
        throw new RuntimeException("İlana ait şirket bilgisi eksik.");
    }

    // 3. Şirket kontrolü
    // Şirket ID'leri null değilse ve eşit değilse erişimi reddet
    Integer jobCompanyId = jobAdv.getCompany() != null ? jobAdv.getCompany().getId() : null;
    Integer employerCompanyId = employer.getCompany() != null ? employer.getCompany().getId() : null;
    
    if (jobCompanyId == null || employerCompanyId == null || !jobCompanyId.equals(employerCompanyId)) {
        throw new RuntimeException("Bu ilana erişim yetkiniz yok.");
    }
    

    // 4. Başvuruları getir
    List<JobApplication> applications = jobApplicationRepository.findByJobAdv(jobAdv);

    List<String> summaries = new ArrayList<>();

    for (JobApplication application : applications) {
        Candidate candidate = application.getCandidate();

        boolean isPrivate = candidate.getProfileDetails() != null &&
                candidate.getProfileDetails().isPrivateProfile();

        String summary = isPrivate
                ? "ADAY (Gizli Profil): [İsim gizli]"
                : "ADAY (Açık Profil): " + candidate.getFirstName() + " " + candidate.getLastName();

        summaries.add(summary);
    }

    return summaries;
}


public List<String> filterApplications(int jobAdvId, String userEmail, int minExperienceYears) {
    // 1. İşvereni email ile al
    Employer employer = employerRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));

    // 2. İlanı al
    JobAdv jobAdv = jobAdvRepository.findById(jobAdvId)
            .orElseThrow(() -> new RuntimeException("İlan bulunamadı."));

    // 3. Şirket karşılaştırması
   // Şirketler veya ID'leri null ise veya eşit değilse erişimi reddet
   Integer jobCompanyId = jobAdv.getCompany() != null ? jobAdv.getCompany().getId() : null;
   Integer employerCompanyId = employer.getCompany() != null ? employer.getCompany().getId() : null;
   
   if (jobCompanyId == null || employerCompanyId == null || !jobCompanyId.equals(employerCompanyId)) {
       throw new RuntimeException("Bu ilana erişim yetkiniz yok.");
   }
   


    // 4. İlanın başvurularını al
    List<JobApplication> applications = jobApplicationRepository.findByJobAdv(jobAdv);

    List<String> results = new ArrayList<>();

    for (JobApplication app : applications) {
        Candidate candidate = app.getCandidate();

        int experienceYears = 0;
        if (candidate.getWorkExperiences() != null) {
            experienceYears = candidate.getWorkExperiences().size(); // her deneyimi 1 yıl gibi say
        }

        if (experienceYears >= minExperienceYears) {
            boolean isPrivate = candidate.getProfileDetails() != null &&
                    candidate.getProfileDetails().isPrivateProfile();

            String summary = isPrivate
                    ? "[Gizli Profil]"
                    : candidate.getFirstName() + " " + candidate.getLastName();

            results.add("ADAY: " + summary);
        }
    }

    return results;
}

    public boolean sendJobOffer1(int applicationId, String employerEmail, JobOffer requestOffer) {
        // 1. Find the employer by email
        Employer employer = employerRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new RuntimeException("Employer not found."));

        // 2. Get the job application
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found."));

        // 3. Check if an offer has already been sent
        if (application.getOffers() != null && !application.getOffers().isEmpty()) {
            return false; // An offer already exists
        }

        // 4. Proceed only if the application status is PENDING
        if(application.getStatus() == ApplicationStatus.PENDING){
            JobOffer offer = new JobOffer();
            offer.setApplication(application);
            offer.setEmployer(employer);
            offer.setSalaryOffer(requestOffer.getSalaryOffer());
            offer.setWorkHours(requestOffer.getWorkHours());
            offer.setStartDate(requestOffer.getStartDate());
            offer.setLocation(requestOffer.getLocation());
            offer.setBenefits(requestOffer.getBenefits());
            offer.setStatus(OfferStatus.PENDING);

            if (application.getOffers() == null) {
                application.setOffers(new ArrayList<>());
            }

            application.getOffers().add(offer);
            application.setStatus(ApplicationStatus.ACCEPTED);

            jobApplicationRepository.save(application); // Cascade will save the offer as well
            return true;
        }

        return false;
    }


    public void sendJobOffer2(int id, String employerEmail, JobOffer requestOffer) {
        // 1. İşvereni email ile bul
        Employer employer = employerRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));


            JobOffer offer = new JobOffer();
            offer.setEmployer(employer);
            offer.setSalaryOffer(requestOffer.getSalaryOffer());
            offer.setWorkHours(requestOffer.getWorkHours());
            offer.setStartDate(requestOffer.getStartDate());
            offer.setLocation(requestOffer.getLocation());
            offer.setBenefits(requestOffer.getBenefits());
            offer.setStatus(OfferStatus.PENDING);


            jobOfferRepository.save(offer);
        }


public void respondToOffer(int offerId, boolean accept) {
    // 1. Teklifi veritabanından bul
    JobOffer offer = jobOfferRepository.findById(offerId)
            .orElseThrow(() -> new RuntimeException("Teklif bulunamadı."));

    // 2. Durumu güncelle
    offer.setStatus(accept ? OfferStatus.ACCEPTED : OfferStatus.REJECTED);
    jobOfferRepository.save(offer);

    System.out.println("📩 Aday teklifi " + (accept ? "KABUL ETTİ ✅" : "REDDETTİ ❌"));

    // 3. Eğer kabul ettiyse ve aday izin verdiyse bilgi göster
    if (accept) {
        JobApplication app = offer.getApplication();

        boolean allowReference = app.isReferencePermission();
        boolean allowContact = app.isContactPermission();

        if (allowReference) {
            System.out.println("✔ Referans bilgileri işverene gösteriliyor.");
        }

        if (allowContact) {
            System.out.println("✔ İletişim bilgileri işverene gösteriliyor.");
        }
    }
}

/**
 * Tüm iş ilanlarını getirir.
 * CandidateController tarafından kullanılır.
 *
 * @return Tüm iş ilanlarının listesi
 */
public List<JobAdv> getAllJobAdv() {
    try {
        return jobAdvRepository.findAll();
    } catch (Exception e) {
        System.err.println("İlanları getirme hatası: " + e.getMessage());
        e.printStackTrace();
        // Hata durumunda boş liste döndür
        return new ArrayList<>();
    }
}

/**
 * İş ilanlarını belirtilen kriterlere göre filtreler.
 * CandidateController tarafından kullanılır.
 *
 * @param jobPositionIds İş pozisyonu ID'leri
 * @param workTypes Çalışma tipleri
 * @param minSalary Minimum maaş
 * @param maxSalary Maksimum maaş
 * @param cities Şehirler
 * @param countries Ülkeler
 * @param companyIds Şirket ID'leri
 * @return Filtrelenmiş iş ilanları listesi
 */
public List<JobAdv> filter(
        List<Integer> jobPositionIds,
        List<String> workTypes, 
        Double minSalary,
        Double maxSalary,
        List<String> cities,
        List<String> countries,
        List<Integer> companyIds) {
    
    // Null değerler için boş liste oluştur, SQL sorgusu daha güvenli çalışır
    if (jobPositionIds == null) jobPositionIds = List.of();
    if (workTypes == null) workTypes = List.of();
    if (cities == null) cities = List.of();
    if (countries == null) countries = List.of();
    if (companyIds == null) companyIds = List.of();
    
    try {
        return jobAdvRepository.filter(jobPositionIds, workTypes, minSalary, maxSalary, cities, countries, companyIds);
    } catch (Exception e) {
        System.err.println("Filtreleme hatası: " + e.getMessage());
        // Bir hata durumunda tüm ilanları getir
        return jobAdvRepository.findAll();
    }
}

/**
 * İlan başvurularını tam JobApplication nesneleri olarak döndürür.
 * Frontend'de aday bilgilerinin tam olarak görüntülenmesi için kullanılır.
 */
public List<JobApplication> getApplicationObjectsForJobAdv(int jobAdvId, String userEmail) {
    // 1. Employer'ı email ile bul
    Employer employer = employerRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));

    Company employerCompany = employer.getCompany();
    if (employerCompany == null) {
        throw new RuntimeException("İşverene ait şirket bilgisi eksik.");
    }

    // 2. İlanı veritabanından al
    JobAdv jobAdv = jobAdvRepository.findById(jobAdvId)
            .orElseThrow(() -> new RuntimeException("İlan bulunamadı."));

    Company jobCompany = jobAdv.getCompany();
    if (jobCompany == null) {
        throw new RuntimeException("İlana ait şirket bilgisi eksik.");
    }

    // 3. Şirket kontrolü
    Integer jobCompanyId = jobAdv.getCompany() != null ? jobAdv.getCompany().getId() : null;
    Integer employerCompanyId = employer.getCompany() != null ? employer.getCompany().getId() : null;
    
    if (jobCompanyId == null || employerCompanyId == null || !jobCompanyId.equals(employerCompanyId)) {
        throw new RuntimeException("Bu ilana erişim yetkiniz yok.");
    }

    // 4. Başvuruları getir ve doğrudan döndür
    return jobApplicationRepository.findByJobAdv(jobAdv);
}

    public void respondToApplication(int applicationId) {
        JobApplication jobApplication = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found."));

        // Check if an offer exists
        if (jobApplication.getOffers() == null || jobApplication.getOffers().isEmpty()) {
            throw new RuntimeException("Cannot decline. No offer has been sent for this application.");
        }

        // Check if already rejected
        if (jobApplication.getStatus() == ApplicationStatus.REJECTED) {
            throw new RuntimeException("The application has already been declined.");
        }

        jobApplication.setStatus(ApplicationStatus.REJECTED);
        jobApplicationRepository.save(jobApplication);
    }


    public List<JobOffer> getJobOffers(int id) {
    Employer emp = employerRepository.findById(id).orElseThrow();

    List<JobOffer> offers = jobOfferRepository.findByEmployer(emp);
    return offers;
    }

    public void scheduleInterview(InterviewDto dto ,String email) {

        if(dto.getInterviewDateTime()==null){
            throw new RuntimeException("Interview date should be selected.");
        }
        Employer employer = employerRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("Employer not found."));

        Candidate candidate = candidateRepository.findById(dto.getCandidateId()).orElseThrow(()-> new RuntimeException("Candidate not found."));

        JobApplication jobApplication= jobApplicationRepository.findById(dto.getApplicationId()).orElseThrow(()-> new RuntimeException("JobApplication not found."));

        if(jobApplication.getStatus().equals(ApplicationStatus.INTERVIEW)){
            throw new RuntimeException("Interview is already sent for this application.");
        }

        JobOffer jobOffer= jobOfferRepository.findById(dto.getOfferId()).orElseThrow(()-> new RuntimeException("JobOffer not found."));

        if(jobOffer.getStatus().equals(OfferStatus.ACCEPTED)){
            Interviews interviews = new Interviews();
            interviews.setCandidate(candidate);
            interviews.setEmployer(employer);
            interviews.setJobApplication(jobApplication);
            interviews.setJobOffer(jobOffer);
            interviews.setInterviewDateTime(dto.getInterviewDateTime());
            interviews.setInterviewType(dto.getInterviewType());
            interviews.setNotes(dto.getNotes());
            interviews.setInterviewStatus(dto.getInterviewStatus());

            interviewRepository.save(interviews);

            jobApplication.setStatus(ApplicationStatus.INTERVIEW);
            jobApplicationRepository.save(jobApplication);

        }
        else{
            throw new RuntimeException("Job Offer not accepted.");
        }

    }

    public List<Map<String, Object>> getInterviews(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));

        List<Map<String, Object>> result = new ArrayList<>();

        if (user instanceof Candidate candidate) {
            List<Interviews> interviews = interviewRepository.findByCandidate(candidate);
            if (interviews == null || interviews.isEmpty()) {
                throw new RuntimeException("Interview not found.");
            }

            for (Interviews interview : interviews) {
                if(interview.getEmployer().isActive() && interview.getJobApplication().getJobAdv().isActive()){
                Map<String, Object> map = new HashMap<>();
                map.put("interviewer", interview.getEmployer().getFirstName() + " " + interview.getEmployer().getLastName());
                map.put("date", interview.getInterviewDateTime());
                map.put("interviewType", interview.getInterviewType());
                map.put("status", interview.getInterviewStatus());
                map.put("description", interview.getJobApplication().getJobAdv().getDescription());
                map.put("notes", interview.getNotes());
                result.add(map);
                }
            }
        } else if (user instanceof Employer employer) {
            List<Interviews> interviews = interviewRepository.findByEmployer(employer);
            if (interviews == null || interviews.isEmpty()) {
                throw new RuntimeException("Interview not found.");
            }

            for (Interviews interview : interviews) {
                Map<String, Object> map = new HashMap<>();
                if(interview.getCandidate().isActive() && interview.getJobApplication().getJobAdv().isActive()) {
                    map.put("interviewer", interview.getCandidate().getFirstName() + " " + interview.getCandidate().getLastName());
                    map.put("date", interview.getInterviewDateTime());
                    map.put("interviewType", interview.getInterviewType());
                    map.put("status", interview.getInterviewStatus());
                    map.put("description", interview.getJobApplication().getJobAdv().getDescription());
                    map.put("notes", interview.getNotes());
                    result.add(map);
                }
            }
        }

        return result;
    }


    public void respondToInterview(int jobAdvId, boolean b, String email) {
    Candidate candidate = candidateRepository.findByEmail(email).orElseThrow(()->new RuntimeException("Candidate not found."));

    JobAdv jobAdv = jobAdvRepository.findById(jobAdvId).orElseThrow(()->new RuntimeException("JobAdv not found."));

    JobApplication jobApplication= jobApplicationRepository.findByJobAdvAndCandidate(jobAdv,candidate);

    if(jobApplication.getStatus().equals(ApplicationStatus.INTERVIEW)){
        Interviews interviews = interviewRepository.findByJobApplicationAndCandidate(jobApplication,candidate);
        if(interviews.getInterviewStatus().equals(InterviewStatus.WAITING)){
            interviews.setInterviewStatus(b ? InterviewStatus.CONFIRMED : InterviewStatus.CANCELLED);
            interviewRepository.save(interviews);
        }
        else{
            throw new RuntimeException("Interview already responded.");
        }
    }
    }
}