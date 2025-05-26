package Backend.controller;

import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.entities.common.JobPositions;
import Backend.entities.common.LanguageProficiency;
import Backend.entities.dto.JobAdvDto;
import Backend.entities.jobAdv.*;
import Backend.entities.user.candidate.Candidate;
import Backend.services.AIRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * AI önerileri için REST Controller sınıfı
 */
@RestController
@RequestMapping("/api/recommendations")
public class AIRecommendationController {

    @Autowired
    private AIRecommendationService aiRecommendationService;

    /**
     * Adaya uygun iş ilanlarını önerir
     * @param candidateId aday ID
     * @param limit maksimum öneri sayısı (varsayılan: 10)
     * @return önerilen iş ilanları listesi
     */
    @GetMapping("/jobs/{candidateId}")
    public List<JobAdvDto> getRecommendedJobsForCandidate(
            @PathVariable Integer candidateId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<JobAdv> recommendations = aiRecommendationService.recommendJobsForCandidate(candidateId, limit);

        List<JobAdvDto> jobAdvDtos = recommendations.stream()
                .filter(jobAdv -> jobAdv.isActive() && jobAdv.getCreatedEmployer() != null && jobAdv.getCreatedEmployer().isActive())
                .map(jobAdv -> {
                    JobAdvDto dto = new JobAdvDto();
                    dto.setId(jobAdv.getId());
                    dto.setDescription(jobAdv.getDescription());
                    dto.setCompanyName(jobAdv.getCompany().getCompanyName());
                    dto.setMinSalary(jobAdv.getMinSalary());
                    dto.setMaxSalary(jobAdv.getMaxSalary());
                    dto.setLastDate(jobAdv.getLastDate());
                    dto.setTravelRest(jobAdv.isTravelRest());
                    dto.setLicense(jobAdv.isLicense());

                    if (jobAdv.getJobCondition() != null) {
                        JobCondition jobCondition = jobAdv.getJobCondition();

                        dto.setWorkType(jobCondition.getWorkType());
                        dto.setEmploymentType(jobCondition.getEmploymentType());
                        if(jobCondition.getCountry() != null){
                            Country country = jobCondition.getCountry();
                            dto.setCountry(jobCondition.getCountry().getName());
                        }
                        if (jobCondition.getCity() != null) {
                            City country = jobCondition.getCity();
                            dto.setCity(jobCondition.getCity().getName());
                        }

                        dto.setMinWorkHours(jobCondition.getMinWorkHours());
                        dto.setMaxWorkHours(jobCondition.getMaxWorkHours());
                    }

                    if (jobAdv.getJobQualification() != null) {
                        JobQualification jobQualification = jobAdv.getJobQualification();

                        dto.setDegreeType(jobQualification.getDegreeType().toString());
                        dto.setJobExperience(jobQualification.getJobExperience().toString());
                        dto.setExperienceYears(jobQualification.getExperienceYears());
                        dto.setMilitaryStatus(jobQualification.getMilitaryStatus().toString());

                        dto.setTechnicalSkills(jobQualification.getTechnicalSkills().stream()
                                .map(skill -> {
                                    TechnicalSkill tech= new TechnicalSkill();
                                    tech.setPositionName(skill.getPositionName());
                                    tech.setSkillLevel(skill.getSkillLevel());
                                    tech.setDescription(skill.getDescription());
                                    return tech;
                                })  // TechnicalSkill'in ismi alınır (örneğin: "Java")
                                .collect(Collectors.toList()));

                        dto.setSocialSkills(jobQualification.getSocialSkills().stream()
                                .map(skill -> {
                                    SocialSkill tech= new SocialSkill();
                                    tech.setPositionName(skill.getPositionName());
                                    tech.setSkillLevel(skill.getSkillLevel());
                                    tech.setDescription(skill.getDescription());
                                    return tech;
                                })
                                .collect(Collectors.toList()));

                        dto.setLanguageProficiencies(
                                jobQualification.getLanguageProficiencies().stream()
                                        .map(lang -> {
                                            LanguageProficiency langDto = new LanguageProficiency();
                                            langDto.setLanguage(lang.getLanguage());
                                            langDto.setReadingLevel(lang.getReadingLevel());
                                            langDto.setWritingLevel(lang.getWritingLevel());
                                            langDto.setSpeakingLevel(lang.getSpeakingLevel());
                                            langDto.setListeningLevel(lang.getListeningLevel());
                                            return langDto;
                                        })
                                        .collect(Collectors.toList())
                        );
                    }
                    if (jobAdv.getBenefits() != null) {
                        dto.setBenefitTypes( jobAdv.getBenefits().stream()
                                .map(benefit -> {
                                    Benefit b = new Benefit();
                                    b.setBenefitType(benefit.getBenefitType());
                                    b.setDescription(benefit.getDescription());
                                    return b;
                                }) // BenefitType enum'u string'e çeviriyoruz
                                .collect(Collectors.toList())
                        );

                    }

                    if (jobAdv.getJobPositions() != null) {
                        dto.setJobPositions( jobAdv.getJobPositions().stream()
                                .map(position -> {
                                    JobPositions positions= new JobPositions();
                                    positions.setPositionType(position.getPositionType());
                                    positions.setCustomJobPosition(position.getCustomJobPosition());
                                    return positions;
                                })
                                .collect(Collectors.toList())
                        );


                    }


                    return dto;
                })
                .collect(Collectors.toList());

        return jobAdvDtos;
    }

    /**
     * İş ilanına uygun adayları önerir
     * @param jobId iş ilanı ID
     * @param limit maksimum öneri sayısı (varsayılan: 10)
     * @return önerilen adaylar listesi
     */
    @GetMapping("/candidates/{jobId}")
    public ResponseEntity<List<Candidate>> getRecommendedCandidatesForJob(
            @PathVariable Integer jobId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<Candidate> recommendations = aiRecommendationService.recommendCandidatesForJob(jobId, limit);
        return ResponseEntity.ok(recommendations);
    }
} 