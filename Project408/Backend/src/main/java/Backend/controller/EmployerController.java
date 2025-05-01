package Backend.controller;

import Backend.entities.company.Company;
import Backend.entities.dto.CandidateProfileDto;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.repository.CandidateRepository;
import Backend.services.CandidateService;
import Backend.services.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employer")
public class EmployerController {
    @Autowired
    CandidateService candidateService;
    @Autowired
    EmployerService employerService;

    @GetMapping("/getAvailableCandidates")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAvailableCandidates());
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<Company> getProfileDetails(@PathVariable("id") int id) {
        return ResponseEntity.ok(employerService.getProfileDetails(id));
    }

}
