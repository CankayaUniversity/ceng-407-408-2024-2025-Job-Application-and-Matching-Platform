package Backend.controller.jobAdv;

import Backend.entities.jobAdv.JobAdv;
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

@RestController
@RequestMapping("/api/job-adv")
@RequiredArgsConstructor
public class JobAdvController {
    @Autowired
    JobAdvService jobAdvService;

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

    // 🔹 4. İşverene ait ilanları getirme
    @GetMapping("/my-jobadvs")
    public ResponseEntity<List<JobAdv>> getMyJobAdvertisements(HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        List<JobAdv> myJobAdvs = jobAdvService.getMyJobAdvs(email);
        return ResponseEntity.ok(myJobAdvs);
    }

    // 🔹 5. İlan başvurularını görüntüleme
    @GetMapping("/{id}/applications")
    public ResponseEntity<List<JobApplication>> getApplications(
            @PathVariable int id,
            HttpServletRequest request) {

        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";

        List<JobApplication> applications = jobAdvService.getApplicationObjectsForJobAdv(id, email);
        return ResponseEntity.ok(applications);
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
