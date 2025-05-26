package Backend.controller;

import Backend.entities.company.Company;
import Backend.entities.dto.PasswordChangeDto;
import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.repository.CandidateRepository;
import Backend.repository.UserRepository;
import Backend.services.CandidateService;
import Backend.services.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.support.lob.TemporaryLobCreator;
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

    @GetMapping("/getCandidates")
    public ResponseEntity<List<Candidate>> getCandidatesByActivityStatus(
            @RequestParam(name = "active", defaultValue = "true") boolean active) {
        return ResponseEntity.ok(candidateService.getCandidatesByActivityStatus(active));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<HashMap<Object,Object> > getProfileDetails(@PathVariable("id") int id) {
        return ResponseEntity.ok(employerService.getProfileDetails(id));
    }

    @PutMapping("/updateProfile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable("id") int id, @RequestBody(required = false) Company company) {
        try {
            Company updated = employerService.updateProfile(id, company);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("errorMessage", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }



    @PostMapping("/passwordChange")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeDto dto) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        try{
            employerService.changePassword(dto,email);
            return ResponseEntity.ok("Password changed!");
        }
        catch(RuntimeException ex){
            return ResponseEntity.badRequest().body("Something went wrong!");
        }

    }

    @DeleteMapping("/deleteAccount")
    public ResponseEntity<String> changePassword() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        try{
            employerService.deleteAccount(email);
            return ResponseEntity.ok("Account deleted!");
        }
        catch(RuntimeException ex){
            return ResponseEntity.badRequest().body("Account cannot be deleted!");
        }

    }

}
