package Backend.controller;

import Backend.entities.company.Company;
import Backend.entities.dto.CandidateProfileDto;
import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.repository.CandidateRepository;
import Backend.repository.UserRepository;
import Backend.services.CandidateService;
import Backend.services.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employer")
public class EmployerController {
    @Autowired
    CandidateService candidateService;
    @Autowired
    EmployerService employerService;
    @Autowired
    UserRepository userRepository;

    @GetMapping("/userName/{id}")
    public ResponseEntity<Map<String, String>> getUserName(@PathVariable("id") int id) {
        User profile = userRepository.findById(id).get();
        Map<String, String> userName = new HashMap<>();
        userName.put("userName", profile.getFirstName() + " " + profile.getLastName());
        return ResponseEntity.ok(userName);

    }

    @GetMapping("/getAvailableCandidates")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAvailableCandidates());
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<Company> getProfileDetails(@PathVariable("id") int id) {
        return ResponseEntity.ok(employerService.getProfileDetails(id));
    }

}
