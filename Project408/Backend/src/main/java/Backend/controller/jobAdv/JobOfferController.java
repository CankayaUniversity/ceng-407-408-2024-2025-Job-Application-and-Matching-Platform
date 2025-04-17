package Backend.controller.jobAdv;

import Backend.entities.offer.JobOffer;
import Backend.services.JobOfferService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-offer")
@RequiredArgsConstructor
public class JobOfferController {

    private final JobOfferService jobOfferService;

    @GetMapping("/my-offers")
    public ResponseEntity<List<JobOffer>> getMyOffers(HttpServletRequest request) {
        String email = (request.getUserPrincipal() != null)
                ? request.getUserPrincipal().getName()
                : "mock@candidate.com";

        List<JobOffer> myOffers = jobOfferService.getMyOffers(email);
        return ResponseEntity.ok(myOffers);
    }
} 