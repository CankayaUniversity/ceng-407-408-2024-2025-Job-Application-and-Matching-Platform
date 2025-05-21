package Backend.controller;

import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.candidate.Candidate;
import Backend.services.AIRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<JobAdv>> getRecommendedJobsForCandidate(
            @PathVariable Integer candidateId,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<JobAdv> recommendations = aiRecommendationService.recommendJobsForCandidate(candidateId, limit);
        return ResponseEntity.ok(recommendations);
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