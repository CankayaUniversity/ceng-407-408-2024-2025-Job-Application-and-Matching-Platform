package Backend.services;

import Backend.core.enums.*;
import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.entities.common.CustomJobPosition;
import Backend.entities.dto.JobAdvCreateDto;
import Backend.entities.jobAdv.*;
import Backend.entities.offer.JobOffer;
import Backend.entities.company.Company;
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
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import java.util.Objects;
import java.util.stream.Collectors;

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


    public void createJobAdv(JobAdvCreateDto request, String employerEmail) {
    Employer employer = employerRepository.findByEmail(employerEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı: " + employerEmail));

    Company company = companyRepository.findById(request.getCompanyId()).orElseThrow(()-> new RuntimeException("Şirket bulunamadı."));

    JobAdv jobAdv = new JobAdv();
    jobAdv.setCompany(company);
    jobAdv.setDescription(request.getDescription());
    jobAdv.setMaxSalary(request.getMinSalary());
    jobAdv.setMinSalary(request.getMaxSalary());
    jobAdv.setLastDate(request.getLastDate());
    jobAdv.setTravelRest(request.getTravelRest());
    jobAdv.setLicense(request.getLicense());
    jobAdv.setCreatedEmployer(employer);

    JobCondition jobCondition = new JobCondition();
    jobCondition.setWorkType(request.getJobConditionWorkType());
    jobCondition.setEmploymentType(request.getJobConditionEmploymentType());
    Country country = countryRepository.findById(request.getJobConditionCountry()).orElseThrow(()->new RuntimeException("Country bulunamadı."));
    jobCondition.setCountry(country);
    City city = cityRepository.findById(request.getJobConditionCity()).orElseThrow(()->new RuntimeException("City bulunamadi"));
    jobCondition.setCity(city);
    jobCondition.setMaxWorkHours(request.getJobConditionMaxWorkHours());
    jobCondition.setMinWorkHours(request.getJobConditionMinWorkHours());


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

        List<Benefit> benefits = new ArrayList<>();
        List<BenefitType> benefitTypes = request.getBenefitTypes();
        List<String> benefitDescriptions = request.getBenefitDescriptions();

        if (benefitTypes != null) {
            for (int i = 0; i < benefitTypes.size(); i++) {
                Benefit benefit = new Benefit();
                benefit.setBenefitType(benefitTypes.get(i));
                if (benefitDescriptions != null && benefitDescriptions.size() > i)
                    benefit.setDescription(benefitDescriptions.get(i));
                benefits.add(benefit);
            }
        }

        List<JobPositions> jobPositions = new ArrayList<>();
        List<JobPosition> jobPositionTypes = request.getJobPositionTypes();
        List<String> customJobPositionNames = request.getCustomJobPositionNames();

        if (jobPositionTypes != null) {
            for (int i = 0; i < jobPositionTypes.size(); i++) {
                JobPositions jp = new JobPositions();
                jp.setPositionType(jobPositionTypes.get(i));
                if (customJobPositionNames != null && customJobPositionNames.size() > i) {
                    CustomJobPosition cjp = new CustomJobPosition();
                    cjp.setPositionName(customJobPositionNames.get(i));
                    jp.setCustomJobPosition(cjp);
                }
                jobPositions.add(jp);
            }
        }

        jobAdv.setJobCondition(jobCondition);
        jobAdv.setJobQualification(jobQualification);
        jobAdv.setBenefits(benefits);
        jobAdv.setJobPositions(jobPositions);

        jobAdvRepository.save(jobAdv);

        System.out.println("✅ İlan başarıyla oluşturuldu: " + jobAdv.getDescription());
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

    jobAdvRepository.delete(jobAdv);
    System.out.println("🗑️ İlan başarıyla silindi. ID: " + jobAdvId);
}

public List<JobAdv> getMyJobAdvs(String userEmail) {
    Employer employer = employerRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));

    Company employerCompany = employer.getCompany();
    if (employerCompany == null) {
        throw new RuntimeException("İşverenin şirket bilgisi eksik.");
    }

    return jobAdvRepository.findByCompanyId(employerCompany.getId());
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

public void sendJobOffer1(int applicationId, String employerEmail, JobOffer requestOffer) {
    // 1. İşvereni email ile bul
    Employer employer = employerRepository.findByEmail(employerEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));

    // 2. İlgili başvuruyu al
    JobApplication application = jobApplicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı."));
    if(application.getStatus() == ApplicationStatus.PENDING){
        // 3. Teklif nesnesini oluştur
        JobOffer offer = new JobOffer();
        offer.setApplication(application);
        offer.setEmployer(employer);
        offer.setSalaryOffer(requestOffer.getSalaryOffer());
        offer.setWorkHours(requestOffer.getWorkHours());
        offer.setStartDate(requestOffer.getStartDate());
        offer.setLocation(requestOffer.getLocation());
        offer.setBenefits(requestOffer.getBenefits());
        offer.setStatus(OfferStatus.PENDING);

        // Maintain bidirectional relationship
        if (application.getOffers() == null) {
            application.setOffers(new ArrayList<>());
        }
        application.getOffers().add(offer);
        application.setStatus(ApplicationStatus.ACCEPTED);
        // 4. Veritabanına kaydet
        jobApplicationRepository.save(application); // Will cascade save the offer
    }


    System.out.println("✅ Teklif başarıyla gönderildi: Aday ID = " + application.getCandidate().getId());
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
    JobApplication jobApplication = jobApplicationRepository.findById(applicationId).orElseThrow();
        jobApplication.setStatus(ApplicationStatus.REJECTED);
        jobApplicationRepository.save(jobApplication);
    }

    public List<JobOffer> getJobOffers(int id) {
    Employer emp = employerRepository.findById(id).orElseThrow();

    List<JobOffer> offers = jobOfferRepository.findByEmployer(emp);
    return offers;
    }
}