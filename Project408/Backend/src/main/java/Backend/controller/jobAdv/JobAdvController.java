package Backend.controller.jobAdv;

import Backend.core.location.Country;
import Backend.entities.dto.JobAdvDto;
import Backend.entities.dto.JobApplicationDto;
import Backend.entities.jobAdv.Benefit;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.jobAdv.JobCondition;
import Backend.entities.jobAdv.JobQualification;
import Backend.entities.offer.JobOffer;
import Backend.entities.user.candidate.JobApplication;
import Backend.request.jobAdv.JobAdvCreateRequest;
import Backend.request.jobAdv.JobAdvUpdateRequest;
import Backend.services.JobAdvService;
import jakarta.servlet.http.HttpServletRequest;
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
                                .map(skill -> skill.getPositionName())  // TechnicalSkill'in ismi alınır (örneğin: "Java")
                                .collect(Collectors.toList()));

                        dto.setSocialSkills(jobQualification.getSocialSkills().stream()
                                .map(skill -> skill.getPositionName())  // SocialSkill'in ismi alınır (örneğin: "Takım Çalışması")
                                .collect(Collectors.toList()));

                        dto.setLanguageProficiencies(jobQualification.getLanguageProficiencies().stream()
                                .map(lang -> lang.getLanguage())  // LanguageProficiency'den dil isimleri alınır
                                .collect(Collectors.toList()));
                    }
                    if (jobAdv.getBenefits() != null) {
                        List<String> benefitTypes = jobAdv.getBenefits().stream()
                                .map(benefit -> benefit.getBenefitType().toString()) // BenefitType enum'u string'e çeviriyoruz
                                .collect(Collectors.toList());

                        List<String> benefitDescriptions = jobAdv.getBenefits().stream()
                                .map(Benefit::getDescription)  // Benefit description'ı alıyoruz
                                .collect(Collectors.toList());

                        dto.setBenefitTypes(benefitTypes);
                        dto.setBenefitDescriptions(benefitDescriptions);
                    }

                    if (jobAdv.getJobPositions() != null) {
                        List<String> positionTypes = jobAdv.getJobPositions().stream()
                                .map(jobPosition -> jobPosition.getPositionType().toString())  // PositionType enum'unu string'e çeviriyoruz
                                .collect(Collectors.toList());

                        List<String> customJobPositions = jobAdv.getJobPositions().stream()
                                .filter(jobPosition -> jobPosition.getCustomJobPosition() != null)
                                .map(jobPosition -> jobPosition.getCustomJobPosition().getPositionName()) // CustomJobPosition isimleri
                                .collect(Collectors.toList());

                        dto.setPositionTypes(positionTypes);
                        dto.setCustomJobPositions(customJobPositions);
                    }


                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(jobAdvDtos);

    }

    // 🔹 5. İlan başvurularını görüntüleme
    @GetMapping("/application/{id}")
    public ResponseEntity<List<JobApplication>> getApplications(
            @PathVariable int id,
            HttpServletRequest request) {

        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        List<JobApplication> applications = jobAdvService.getApplicationObjectsForJobAdv(id, email);


        return ResponseEntity.ok(applications);
    }


    // 🔹 1. İlan Oluşturma
    @PostMapping("/create")
    public ResponseEntity<String> createJobAdv(
            @RequestBody JobAdvCreateRequest request,
            HttpServletRequest httpRequest) {

        String email = (httpRequest.getUserPrincipal() != null)
                ? httpRequest.getUserPrincipal().getName()
                : "mock@employer.com"; // geçici

        jobAdvService.createJobAdv(request, email);
        return ResponseEntity.ok("İlan başarıyla oluşturuldu.");
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
    @DeleteMapping("/{id}")
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
    @PostMapping("/application/{applicationId}/offer")
    public ResponseEntity<String> sendJobOffer(
            @PathVariable int applicationId,
            @RequestBody JobOffer offerDetails,
            HttpServletRequest request) {

        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        jobAdvService.sendJobOffer(applicationId, email, offerDetails);
        return ResponseEntity.ok("Teklif başarıyla gönderildi.");
    }

    // 🔹 9. Adayın teklife yanıtı
    @PutMapping("/offer/{offerId}/respond")
    public ResponseEntity<String> respondToOffer(
            @PathVariable int offerId,
            @RequestParam boolean accept) {

        jobAdvService.respondToOffer(offerId, accept);
        return ResponseEntity.ok("Teklif durumu güncellendi.");
    }
}
