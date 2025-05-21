package Backend.services;

import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.candidate.Candidate;
import Backend.repository.CandidateRepository;
import Backend.repository.JobAdvRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

/**
 * AI model servisi ile haberleşen ve önerileri sağlayan servis
 */
@Service
public class AIRecommendationService {

    @Autowired
    private JobAdvRepository jobAdvRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.service.url:http://localhost:5000}")
    private String aiServiceUrl;

    /**
     * Adaya uygun iş ilanlarını önerir
     * @param candidateId aday ID
     * @param limit maksimum öneri sayısı
     * @return önerilen iş ilanları listesi
     */
    public List<JobAdv> recommendJobsForCandidate(Integer candidateId, int limit) {
        // Adayı veritabanından al
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Tüm iş ilanlarını al
        List<JobAdv> allJobs = jobAdvRepository.findAll();

        // Aday profilini model için uygun formata dönüştür
        Map<String, Object> candidateProfile = convertCandidateToModelFormat(candidate);

        // İş ilanlarını model için uygun formata dönüştür
        List<Map<String, Object>> jobPool = allJobs.stream()
                .map(this::convertJobToModelFormat)
                .collect(Collectors.toList());

        // API isteği için gövde oluştur
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("candidate_profile", candidateProfile);
        requestBody.put("job_pool", jobPool);
        requestBody.put("limit", limit);

        // API'ye istek gönder
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    aiServiceUrl + "/recommend-jobs", request, Map.class);

            // Sonuçları işle
            if (response.getBody() != null && response.getBody().containsKey("job_ids")) {
                @SuppressWarnings("unchecked")
                List<Integer> recommendedJobIds = (List<Integer>) response.getBody().get("job_ids");
                
                // Önerilen iş ilanlarını getir
                return allJobs.stream()
                        .filter(job -> recommendedJobIds.contains(job.getId()))
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Collections.emptyList();
    }

    /**
     * İş ilanına uygun adayları önerir
     * @param jobId iş ilanı ID
     * @param limit maksimum öneri sayısı
     * @return önerilen adaylar listesi
     */
    public List<Candidate> recommendCandidatesForJob(Integer jobId, int limit) {
        // İş ilanını veritabanından al
        JobAdv job = jobAdvRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Tüm adayları al
        List<Candidate> allCandidates = candidateRepository.findAll();

        // İş ilanı profilini model için uygun formata dönüştür
        Map<String, Object> jobProfile = convertJobToModelFormat(job);

        // Adayları model için uygun formata dönüştür
        List<Map<String, Object>> candidatePool = allCandidates.stream()
                .map(this::convertCandidateToModelFormat)
                .collect(Collectors.toList());

        // API isteği için gövde oluştur
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("job_profile", jobProfile);
        requestBody.put("candidate_pool", candidatePool);
        requestBody.put("limit", limit);

        // API'ye istek gönder
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    aiServiceUrl + "/recommend-candidates", request, Map.class);

            // Sonuçları işle
            if (response.getBody() != null && response.getBody().containsKey("candidate_ids")) {
                @SuppressWarnings("unchecked")
                List<Integer> recommendedCandidateIds = (List<Integer>) response.getBody().get("candidate_ids");
                
                // Önerilen adayları getir
                return allCandidates.stream()
                        .filter(candidate -> recommendedCandidateIds.contains(candidate.getId()))
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Collections.emptyList();
    }

    /**
     * Aday nesnesini model için uygun formata dönüştürür
     */
    private Map<String, Object> convertCandidateToModelFormat(Candidate candidate) {
        Map<String, Object> candidateMap = new HashMap<>();
        
        // ID ekle
        candidateMap.put("id", candidate.getId());
        
        // Eğitim bilgileri
        if (candidate.getEducation() != null) {
            candidateMap.put("candidate_degreeType", candidate.getEducation().getDegreeType().toString());
            
            // Eğitim bilgilerini en yüksek dereceli eğitimden al
            String department = "";
            int graduationYear = 0;
            double gpa = 0.0;
            
            if (candidate.getEducation().getDoctorateDepartment() != null) {
                department = candidate.getEducation().getDoctorateDepartment().getName();
                if (candidate.getEducation().getDoctorateEndDate() != null) {
                    graduationYear = candidate.getEducation().getDoctorateEndDate().getYear();
                }
                // GPA için bir alan yok, varsayılan değer kullan
            } else if (candidate.getEducation().getMasterDepartment() != null) {
                department = candidate.getEducation().getMasterDepartment().getName();
                if (candidate.getEducation().getMasterEndDate() != null) {
                    graduationYear = candidate.getEducation().getMasterEndDate().getYear();
                }
                // GPA için bir alan yok, varsayılan değer kullan
            } else if (candidate.getEducation().getBachelorDepartment() != null) {
                department = candidate.getEducation().getBachelorDepartment().getName();
                if (candidate.getEducation().getBachelorEndDate() != null) {
                    graduationYear = candidate.getEducation().getBachelorEndDate().getYear();
                }
                // GPA için bir alan yok, varsayılan değer kullan
            } else if (candidate.getEducation().getAssociateDepartment() != null) {
                department = candidate.getEducation().getAssociateDepartment().getName();
                if (candidate.getEducation().getAssociateEndDate() != null) {
                    graduationYear = candidate.getEducation().getAssociateEndDate().getYear();
                }
                // GPA için bir alan yok, varsayılan değer kullan
            }
            
            candidateMap.put("candidate_department", department);
            candidateMap.put("candidate_graduationYear", graduationYear);
            candidateMap.put("candidate_gpa", gpa);
        }
        
        // İş tercihleri
        if (candidate.getJobPreferences() != null) {
            candidateMap.put("candidate_preferredWorkType", candidate.getJobPreferences().getPreferredWorkType().toString());
            candidateMap.put("candidate_minWorkHours", candidate.getJobPreferences().getMinWorkHour());
            candidateMap.put("candidate_maxWorkHours", candidate.getJobPreferences().getMaxWorkHour());
            candidateMap.put("candidate_canTravel", candidate.getJobPreferences().isCanTravel());
            candidateMap.put("candidate_expectedSalary", candidate.getJobPreferences().getExpectedSalary());
            
            // Tercih edilen pozisyonlar
            if (candidate.getJobPreferences().getPreferredPositions() != null && 
                !candidate.getJobPreferences().getPreferredPositions().isEmpty()) {
                candidateMap.put("candidate_preferredPosition", 
                        candidate.getJobPreferences().getPreferredPositions().get(0).getPositionType().toString());
            }
        }
        
        // İş deneyimi
        if (candidate.getWorkExperiences() != null && !candidate.getWorkExperiences().isEmpty()) {
            // Toplam deneyim yılı - getDurationYears() metodu yerine uygun bir hesaplama
            int totalExperienceYears = candidate.getWorkExperiences().stream()
                    .mapToInt(exp -> {
                        if (exp.getEndDate() != null && exp.getStartDate() != null) {
                            return exp.getEndDate().getYear() - exp.getStartDate().getYear();
                        }
                        return 0;
                    })
                    .sum();
            candidateMap.put("candidate_experienceYears", totalExperienceYears);
            
            // Deneyim seviyesi (iş tecrübesi durumu)
            String jobExperience = totalExperienceYears > 2 ? "EXPERIENCED" : "ENTRY_LEVEL";
            candidateMap.put("candidate_jobExperience", jobExperience);
        } else {
            candidateMap.put("candidate_experienceYears", 0);
            candidateMap.put("candidate_jobExperience", "ENTRY_LEVEL");
        }
        
        // Dil yetkinlikleri (ilk dili kullan)
        if (candidate.getLanguageProficiency() != null && !candidate.getLanguageProficiency().isEmpty()) {
            candidateMap.put("candidate_language", 
                    candidate.getLanguageProficiency().get(0).getLanguage().toString());
            candidateMap.put("candidate_reading", 
                    candidate.getLanguageProficiency().get(0).getReadingLevel().toString());
            candidateMap.put("candidate_writing", 
                    candidate.getLanguageProficiency().get(0).getWritingLevel().toString());
            candidateMap.put("candidate_speaking", 
                    candidate.getLanguageProficiency().get(0).getSpeakingLevel().toString());
            candidateMap.put("candidate_listening", 
                    candidate.getLanguageProficiency().get(0).getListeningLevel().toString());
        }
        
        // Sertifika ve proje sayıları
        candidateMap.put("candidate_certificationCount", 
                candidate.getCertifications() != null ? candidate.getCertifications().size() : 0);
        candidateMap.put("candidate_projectCount", 
                candidate.getProjects() != null ? candidate.getProjects().size() : 0);
        
        // Profil detayları
        if (candidate.getProfileDetails() != null) {
            candidateMap.put("candidate_gender", 
                    candidate.getProfileDetails().getGender() != null ? 
                    candidate.getProfileDetails().getGender().toString() : "UNKNOWN");
            candidateMap.put("candidate_militaryStatus", 
                    candidate.getProfileDetails().getMilitaryStatus() != null ? 
                    candidate.getProfileDetails().getMilitaryStatus().toString() : "NOT_APPLICABLE");
            candidateMap.put("candidate_disabilityStatus", 
                    candidate.getProfileDetails().getDisabilityStatus() != null ? 
                    candidate.getProfileDetails().getDisabilityStatus().toString() : "NO_DISABILITY");
            candidateMap.put("candidate_maritalStatus", 
                    candidate.getProfileDetails().getMaritalStatus() != null ? 
                    candidate.getProfileDetails().getMaritalStatus().toString() : "SINGLE");
            candidateMap.put("candidate_drivingLicense", candidate.getProfileDetails().isDrivingLicense());
        }
        
        return candidateMap;
    }

    /**
     * İş ilanı nesnesini model için uygun formata dönüştürür
     */
    private Map<String, Object> convertJobToModelFormat(JobAdv job) {
        Map<String, Object> jobMap = new HashMap<>();
        
        // ID ekle
        jobMap.put("id", job.getId());
        
        // İş pozisyonu
        if (job.getJobPositions() != null && !job.getJobPositions().isEmpty()) {
            jobMap.put("job_positionName", job.getJobPositions().get(0).getPositionType().toString());
        }
        
        // Şirket bilgileri
        if (job.getCompany() != null) {
            jobMap.put("job_industry", job.getCompany().getIndustry());
            jobMap.put("job_employeeCount", job.getCompany().getEmployeeCount());
            jobMap.put("job_establishedDate", 
                    job.getCompany().getEstablishedDate() != null ? 
                    job.getCompany().getEstablishedDate().getYear() : 2000);
        }
        
        // Maaş bilgileri
        jobMap.put("job_minSalary", job.getMinSalary());
        jobMap.put("job_maxSalary", job.getMaxSalary());
        
        // İş koşulları
        jobMap.put("job_travelRest", job.isTravelRest());
        jobMap.put("job_licenseRequired", job.isLicense());
        
        // İş koşulları detayları
        if (job.getJobCondition() != null) {
            jobMap.put("job_workType", job.getJobCondition().getWorkType().toString());
            jobMap.put("job_employmentType", job.getJobCondition().getEmploymentType().toString());
            jobMap.put("job_minWorkHours", job.getJobCondition().getMinWorkHours());
            jobMap.put("job_maxWorkHours", job.getJobCondition().getMaxWorkHours());
        }
        
        // Yeterlilikler
        if (job.getJobQualification() != null) {
            jobMap.put("job_degreeType", job.getJobQualification().getDegreeType().toString());
            jobMap.put("job_jobExperience", job.getJobQualification().getJobExperience().toString());
            jobMap.put("job_experienceYears", job.getJobQualification().getExperienceYears());
            
            // Beceri sayıları
            jobMap.put("job_technicalSkillCount", 
                    job.getJobQualification().getTechnicalSkills() != null ? 
                            job.getJobQualification().getTechnicalSkills().size() : 0);
            jobMap.put("job_socialSkillCount", 
                    job.getJobQualification().getSocialSkills() != null ? 
                            job.getJobQualification().getSocialSkills().size() : 0);
            
            // Dil yetkinlikleri (ilk dili kullan)
            if (job.getJobQualification().getLanguageProficiencies() != null && 
                    !job.getJobQualification().getLanguageProficiencies().isEmpty()) {
                jobMap.put("job_language", 
                        job.getJobQualification().getLanguageProficiencies().get(0).getLanguage().toString());
                jobMap.put("job_reading", 
                        job.getJobQualification().getLanguageProficiencies().get(0).getReadingLevel().toString());
                jobMap.put("job_writing", 
                        job.getJobQualification().getLanguageProficiencies().get(0).getWritingLevel().toString());
                jobMap.put("job_speaking", 
                        job.getJobQualification().getLanguageProficiencies().get(0).getSpeakingLevel().toString());
                jobMap.put("job_listening", 
                        job.getJobQualification().getLanguageProficiencies().get(0).getListeningLevel().toString());
            }
        }
        
        return jobMap;
    }
} 