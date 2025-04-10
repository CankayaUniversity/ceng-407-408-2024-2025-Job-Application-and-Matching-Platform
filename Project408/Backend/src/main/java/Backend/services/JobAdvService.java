package Backend.services;

import Backend.core.enums.ApplicationStatus;
import Backend.core.enums.EmploymentType;
import Backend.core.enums.JobPosition;
import Backend.core.enums.LanguageLevel;
import Backend.core.enums.OfferStatus;
import Backend.core.location.Country;
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
import Backend.repository.CandidateRepository;
import Backend.repository.EmployerRepository;
import Backend.repository.JobAdvRepository;
import Backend.repository.JobApplicationRepository;
import Backend.repository.JobOfferRepository;
import Backend.repository.CountryRepository;
import Backend.repository.JobPositionsRepository;
import Backend.repository.LanguageProficiencyRepository;
import Backend.request.jobAdv.JobAdvCreateRequest;
import Backend.request.jobAdv.JobAdvUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class JobAdvService {

private final JobAdvRepository jobAdvRepository;
private final EmployerRepository employerRepository;
private final CountryRepository countryRepository;
private final JobPositionsRepository jobPositionsRepository;
private final LanguageProficiencyRepository languageProficiencyRepository;

private final CandidateRepository candidateRepository;
private final JobApplicationRepository jobApplicationRepository;
private final JobOfferRepository jobOfferRepository;



public void createJobAdv(JobAdvCreateRequest request, String employerEmail) {
    Employer employer = employerRepository.findByEmail(employerEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı: " + employerEmail));

    Company company = employer.getCompany();
    if (company == null) {
        throw new RuntimeException("İşverene ait şirket bulunamadı.");
    }

    Country country = countryRepository.findById(request.getCountryId())
            .orElseThrow(() -> new RuntimeException("Ülke bulunamadı: ID=" + request.getCountryId()));

    JobCondition condition = new JobCondition();
    condition.setWorkType(request.getWorkType());
    condition.setEmploymentType(request.getEmploymentType());
    condition.setCountry(country);
    condition.setMinWorkHours(request.getMinWorkHours());
    condition.setMaxWorkHours(request.getMaxWorkHours());

    JobQualification qualification = new JobQualification();
    qualification.setDegreeType(request.getDegreeType());
    qualification.setJobExperience(request.getJobExperience());
    qualification.setExperienceYears(request.getExperienceYears());
    qualification.setMilitaryStatus(request.getMilitaryStatus());

    List<TechnicalSkill> technicalSkills = request.getTechnicalSkills().stream().map(skill -> {
        TechnicalSkill ts = new TechnicalSkill();
        ts.setPositionName(skill);
        ts.setJobQualification(qualification);
        return ts;
    }).toList();

    List<SocialSkill> socialSkills = request.getSocialSkills().stream().map(skill -> {
        SocialSkill ss = new SocialSkill();
        ss.setPositionName(skill);
        ss.setJobQualification(qualification);
        return ss;
    }).toList();

    qualification.setTechnicalSkills(technicalSkills);
    qualification.setSocialSkills(socialSkills);

    List<LanguageProficiency> languageProficiencies = languageProficiencyRepository.findAllById(request.getLanguageProficiencyIds());
    qualification.setLanguageProficiencies(languageProficiencies);

    List<JobPositions> jobPositions = jobPositionsRepository.findAllById(request.getJobPositionIds());

    JobAdv jobAdv = new JobAdv();
    jobAdv.setCompany(company);
    jobAdv.setCreatedEmployer(employer);
    jobAdv.setDescription(request.getDescription());
    jobAdv.setMinSalary(request.getMinSalary());
    jobAdv.setMaxSalary(request.getMaxSalary());
    jobAdv.setLastDate(request.getDeadline());
    jobAdv.setTravelRest(request.isTravelRest());
    jobAdv.setLicense(request.isLicense());
    jobAdv.setJobCondition(condition);
    jobAdv.setJobQualification(qualification);
    jobAdv.setJobPositions(jobPositions);
    jobAdv.setBenefits(new ArrayList<>());

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

public void sendJobOffer(int applicationId, String employerEmail, JobOffer requestOffer) {
    // 1. İşvereni email ile bul
    Employer employer = employerRepository.findByEmail(employerEmail)
            .orElseThrow(() -> new RuntimeException("İşveren bulunamadı."));

    // 2. İlgili başvuruyu al
    JobApplication application = jobApplicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı."));

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

    // 4. Veritabanına kaydet
    jobApplicationRepository.save(application); // Will cascade save the offer

    System.out.println("✅ Teklif başarıyla gönderildi: Aday ID = " + application.getCandidate().getId());
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

}