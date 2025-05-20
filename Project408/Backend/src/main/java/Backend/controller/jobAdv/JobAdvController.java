package Backend.controller.jobAdv;

import Backend.core.enums.JobPosition;
import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.entities.common.JobPositions;
import Backend.entities.common.LanguageProficiency;
import Backend.entities.dto.CandidateApplicationDto;
import Backend.entities.dto.JobAdvCreateDto;
import Backend.entities.dto.JobAdvDto;
import Backend.entities.dto.JobApplicationDto;
import Backend.entities.jobAdv.*;
import Backend.entities.offer.JobOffer;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobApplication;
import Backend.request.jobAdv.JobAdvCreateRequest;
import Backend.request.jobAdv.JobAdvUpdateRequest;
import Backend.services.JobAdvService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/job-adv")
@RequiredArgsConstructor
public class JobAdvController {
    @Autowired
    JobAdvService jobAdvService;


    // 🔹 4. İşverene ait ilanları getirme
    @GetMapping("/my-jobadvs")
    public ResponseEntity<List<JobAdvDto>> getMyJobAdvertisements(HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        List<JobAdv> myJobAdvs = jobAdvService.getMyJobAdvs(email);

        List<JobAdvDto> jobAdvDtos = myJobAdvs.stream()
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
                        if (jobCondition.getCountry() != null) {
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

                        // Teknik ve sosyal becerileri alıyoruz
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
        return ResponseEntity.ok(jobAdvDtos);

    }

    // 🔹 5. İlan başvurularını görüntüleme
    @GetMapping("/application/{id}")
    public ResponseEntity<List<CandidateApplicationDto>> getApplications(
            @PathVariable int id,
            HttpServletRequest request) {

        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        List<JobApplication> applications = jobAdvService.getApplicationObjectsForJobAdv(id, email);
        List<CandidateApplicationDto> result = applications.stream()
                .map(app -> new CandidateApplicationDto(app.getId(), app.getCandidate()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);

    }


    // 🔹 1. İlan Oluşturma
    @PostMapping("/create")
    public ResponseEntity<String> createJobAdv(
            @RequestBody JobAdvCreateDto request,
            HttpServletRequest httpRequest) {

        String email = (httpRequest.getUserPrincipal() != null)
                ? httpRequest.getUserPrincipal().getName()
                : "mock@employer.com"; // geçici

        jobAdvService.createJobAdv(request, email);
        return ResponseEntity.ok("Job Advertisement Created Successfully!");
    }

    // 🔹 2. İlan Güncelleme
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateJobAdv(
            @PathVariable int id,
            @RequestBody JobAdvUpdateRequest request,
            HttpServletRequest httpRequest) {

        String email = (httpRequest.getUserPrincipal() != null)
                ? httpRequest.getUserPrincipal().getName()
                : "mock@employer.com";

        jobAdvService.updateJobAdv(id, email, request);
        return ResponseEntity.ok("İlan başarıyla güncellendi.");
    }

    // 🔹 3. İlan Silme
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteJobAdvertisement(
            @PathVariable int id,
            HttpServletRequest request) {

        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        jobAdvService.deleteJobAdv(id, email);
        return ResponseEntity.ok("İlan başarıyla silindi.");
    }



    // 🔸 6. İlana başvurma (aday)
    @PostMapping("/apply/{id}")
    public ResponseEntity<String> applyForJob(
            @PathVariable int id,
            HttpServletRequest request) {

        String candidateEmail = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@candidate.com";

        jobAdvService.applyForJob(id, candidateEmail);
        return ResponseEntity.ok("Başvurunuz başarıyla alındı.");
    }

    // 🔹 7. Aday filtreleme (deneyim yılına göre)
    @GetMapping("/{id}/applications/filter")
    public ResponseEntity<List<String>> filterApplications(
            @PathVariable int id,
            @RequestParam int minExperienceYears,
            HttpServletRequest request) {

        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        List<String> filtered = jobAdvService.filterApplications(id, email, minExperienceYears);
        return ResponseEntity.ok(filtered);
    }

    // 🔹 8. Adaya teklif gönderme
    @PostMapping("/application/{applicationId}")
    public ResponseEntity<String> sendJobApp(
            @PathVariable int applicationId,
            @RequestBody JobOffer offerDetails,
            HttpServletRequest request) {

        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        jobAdvService.sendJobOffer1(applicationId, email, offerDetails);
        return ResponseEntity.ok("Teklif başarıyla gönderildi.");
    }

    @PostMapping("/offer/{candidateId}")
    public ResponseEntity<String> sendJobOffer(
            @PathVariable("candidateId") int candidateId,
            @RequestBody JobOffer offerDetails,
            HttpServletRequest request) {

        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        jobAdvService.sendJobOffer2(candidateId,email, offerDetails);
        return ResponseEntity.ok("Teklif başarıyla gönderildi.");
    }

    @PostMapping("/offer/{id}")
    public ResponseEntity<List<JobOffer>> getJobOffers(
            @PathVariable int id) {

        return ResponseEntity.ok(jobAdvService.getJobOffers(id));
    }

    @PutMapping("/decline/{applicationId}")
    public ResponseEntity<String> respondToApplication(
            @PathVariable int applicationId) {
        jobAdvService.respondToApplication(applicationId);
        return ResponseEntity.ok("Teklif durumu güncellendi.");
    }

    @PutMapping("/declineOffer/{offerId}")
    public ResponseEntity<String> declineTheOffer(
            @PathVariable int offerId) {
        jobAdvService.respondToOffer(offerId,false);
        return ResponseEntity.ok("Teklif durumu güncellendi.");
    }

    @PutMapping("/offer/{offerId}")
    public ResponseEntity<String> respondToOffer(
            @PathVariable int offerId) {
        jobAdvService.respondToOffer(offerId,true);
        return ResponseEntity.ok("Teklif durumu güncellendi.");
    }

}
