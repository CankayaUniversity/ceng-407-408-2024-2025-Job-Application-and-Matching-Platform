package Backend.controller;

import Backend.entities.dto.FilterDto;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.candidate.Candidate;
import Backend.services.CandidateService;
import Backend.services.JobAdvService;
import Backend.services.JwtService;
import Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/candidate")
public class CandidateController {

    @Autowired
    CandidateService candidateService;

    @Autowired
    JwtService jwtService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JobAdvService jobAdvService;

    // Profil oluşturma
    @PostMapping("/createProfile")
    public ResponseEntity<Candidate> createProfile(@RequestHeader("Authorization") String token, @RequestBody Candidate candidate) {
        // Token'dan e-posta adresini çıkar
        String email = jwtService.extractEmail(token.replace("Bearer ", ""));

        // Profil oluşturma işlemini servis üzerinden yap
        return ResponseEntity.ok(candidateService.createProfile(email, candidate));
    }

    // Profil güncelleme
    @PutMapping("/updateProfile")
    public ResponseEntity<Candidate> updateProfile(@RequestHeader("Authorization") String token, @RequestBody Candidate candidate) {
        // Token'dan e-posta adresini çıkar
        String email = jwtService.extractEmail(token.replace("Bearer ", ""));

        // Profil güncelleme işlemini servis üzerinden yap
        return ResponseEntity.ok(candidateService.updateProfile(email, candidate));
    }

    // Profil silme
    @DeleteMapping("/deleteProfile")
    public ResponseEntity<String> deleteProfile(@RequestHeader("Authorization") String token) {
        // Token'dan e-posta adresini çıkar
        String email = jwtService.extractEmail(token.replace("Bearer ", ""));

        // Profil silme işlemini servis üzerinden yap
        candidateService.deleteProfile(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getAllJobAdv")
    public ResponseEntity<List<JobAdv>> getAllJobAdv() {
        return ResponseEntity.ok(jobAdvService.getAllJobAdv());

    }

    @PostMapping("/filterJobAdv")
    public ResponseEntity<List<JobAdv>> filterJobAdv(@RequestBody FilterDto filterDto) {
        return ResponseEntity.ok(jobAdvService.filter(
                filterDto.getJobPositionIds(),
                filterDto.getWorkTypes(),
                filterDto.getMinSalary(),
                filterDto.getMaxSalary(),
                filterDto.getCities(),
                filterDto.getCountries(),
                filterDto.getCompanyIds())
        );

    }

    @PostMapping("/applyJobAdv/{id}")
    public ResponseEntity<String> applyJobAdv(@RequestHeader("Authorization") String token, @PathVariable("id") Integer id) {
        String email = jwtService.extractEmail(token.replace("Bearer ", ""));
        candidateService.applyToJobAdv(email, id);
        return ResponseEntity.ok("Başvuru başarılı!");
    }




}
