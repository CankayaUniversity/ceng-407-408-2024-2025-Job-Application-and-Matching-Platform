package Backend.controller.jobAdv;

import Backend.core.enums.JobPosition;
import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.entities.common.JobPositions;
import Backend.entities.common.LanguageProficiency;
import Backend.entities.dto.*;
import Backend.entities.dto.JobAdvDto;
import Backend.entities.jobAdv.*;
import Backend.entities.offer.JobOffer;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobApplication;
import Backend.entities.user.employer.Employer;
import Backend.request.jobAdv.JobAdvCreateRequest;
import Backend.request.jobAdv.JobAdvUpdateRequest;
import Backend.repository.EmployerRepository;
import Backend.services.JobAdvService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/job-adv")
@RequiredArgsConstructor
public class JobAdvController {
    @Autowired
    JobAdvService jobAdvService;
    @Autowired // Added for fetching Employer to get company ID
    EmployerRepository employerRepository;


    // 🔹 4. İşverene ait ilanları getirme
    @GetMapping("/my-jobadvs")
    public ResponseEntity<List<JobAdvDto>> getMyJobAdvertisements(
            HttpServletRequest request,
            @RequestParam(required = false) String positionName,
            @RequestParam(required = false) String status, // e.g., "ACTIVE", "EXPIRED", "ALL"
            @RequestParam(required = false) String workType // e.g., "REMOTE", "OFFICE", "HYBRID"
    ) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                // Use a non-null default for local testing if principal is null, or handle error
                : "mock@employer.com"; 

        // Fetch employer to get company, this is needed by the service method as per current design
        // Consider if JobAdvService.getMyJobAdvs should resolve employer internally
        Employer employer = employerRepository.findByEmail(email)
                .orElse(null); // Handle if employer not found, though principal implies existence
        
        if (employer == null) {
             // Or throw an exception, return 403/404 etc.
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.emptyList());
        }

        // Call the updated service method
        List<JobAdvDto> jobAdvDtos = jobAdvService.getMyJobAdvs(employer, positionName, status, workType);
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
                .filter(app ->
                        app.getCandidate() != null && app.getCandidate().isActive() &&
                                app.getJobAdv() != null && app.getJobAdv().isActive() &&
                                app.getJobAdv().getCompany() != null && app.getJobAdv().getCompany().isActive() // employer için company üzerinden aktif kontrolü
                )
                .map(app -> new CandidateApplicationDto(app.getId(), app.getCandidate()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);

    }


    @PostMapping("/create")
    public ResponseEntity<String> createJobAdv(
            @RequestBody JobAdvCreateDto request,
            HttpServletRequest httpRequest) {
        try {
            String email = (httpRequest.getUserPrincipal() != null)
                    ? httpRequest.getUserPrincipal().getName()
                    : "mock@employer.com"; // geçici

            jobAdvService.createJobAdv(request, email);
            return ResponseEntity.ok("Job Advertisement Created Successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create job advertisement! ");
        }
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

        boolean success = jobAdvService.sendJobOffer1(applicationId, email, offerDetails);

        if (success) {
            return ResponseEntity.ok("Offer successfully sent.");
        } else {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("An offer has already been sent for this application.");
        }
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
    public ResponseEntity<String> respondToApplication(@PathVariable int applicationId) {
        try {
            jobAdvService.respondToApplication(applicationId);
            return ResponseEntity.ok("Offer status updated successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


    @PutMapping("/declineOffer/{offerId}")
    public ResponseEntity<String> declineTheOffer(@PathVariable int offerId) {
        jobAdvService.respondToOffer(offerId, false);
        return ResponseEntity.ok("Offer declined successfully.");
    }

    @PutMapping("/offer/{offerId}")
    public ResponseEntity<String> respondToOffer(@PathVariable int offerId) {
        jobAdvService.respondToOffer(offerId, true);
        return ResponseEntity.ok("Offer accepted successfully.");
    }

    @PutMapping("/interview")
    public ResponseEntity<String> interview(@RequestBody InterviewDto dto,HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";
        try {
            jobAdvService.scheduleInterview(dto,email);
            return ResponseEntity.ok("Interview scheduled successfully.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/getInterviews")
    public ResponseEntity<?> getInterviews(HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";
        try {
            List<Map<String,Object>> interviews = jobAdvService.getInterviews(email);
            return ResponseEntity.ok(interviews);
        } catch (RuntimeException ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/declineInterview/{jobAdvId}")
    public ResponseEntity<String> declineInterview(@PathVariable int jobAdvId,HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";
        try{
            jobAdvService.respondToInterview(jobAdvId, false,email);
            return ResponseEntity.ok("Interview declined successfully.");
        }
        catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }


    }

    @PutMapping("/acceptInterview/{jobAdvId}")
    public ResponseEntity<String> acceptInterview(@PathVariable int jobAdvId,HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@employer.com";
        try {
            jobAdvService.respondToInterview(jobAdvId, true,email);
            return ResponseEntity.ok("Interview accepted successfully.");
        }catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }

    }


}
