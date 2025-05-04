package Backend.controller.jobAdv;

import Backend.entities.offer.JobOffer;
import Backend.entities.user.candidate.JobApplication;
import Backend.services.JobOfferService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/job-offer")
@RequiredArgsConstructor
public class JobOfferController {
    @Autowired
    JobOfferService jobOfferService;

    @GetMapping("/my-offers")
    public ResponseEntity<List<Map<String, Object>>> getMyOffers(HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@candidate.com";

        List<Map<String, Object>> myOffers = jobOfferService.getMyOffers(email);
        return ResponseEntity.ok(myOffers);
    }
    @GetMapping("/empOffers")
    public ResponseEntity<List<Map<String, Object>>> empOffers(HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@candidate.com";

        List<Map<String, Object>> myOffers = jobOfferService.getMyOffersEmp(email);
        return ResponseEntity.ok(myOffers);
    }
} 