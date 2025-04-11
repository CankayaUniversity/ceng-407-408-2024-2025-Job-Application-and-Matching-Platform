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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
    public ResponseEntity<Candidate> createProfile(@RequestBody Candidate candidate) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();

        // Profil oluşturma işlemini servis üzerinden yap
        return ResponseEntity.ok(candidateService.createProfile(email, candidate));
    }

    // Profil güncelleme
    @PutMapping("/updateProfile")
    public ResponseEntity<Candidate> updateProfile( @RequestBody Candidate candidate) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();

        // Profil güncelleme işlemini servis üzerinden yap
        return ResponseEntity.ok(candidateService.updateProfile(email, candidate));
    }

    // Profil silme
    @DeleteMapping("/deleteProfile")
    public ResponseEntity<String> deleteProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();

        candidateService.deleteProfile(email);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getAllJobAdv")
<<<<<<< HEAD
    public ResponseEntity<List<JobAdv>> getAllJobAdv() {
        try {
            List<JobAdv> allJobAdvs = jobAdvService.getAllJobAdv();
            return ResponseEntity.ok(allJobAdvs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
=======
    public List<JobAdv> getAllJobAdv() {
        List<JobAdv> jobAdvs = jobAdvService.getAllJobAdv();
        // Gereksiz filtreleme veya düzenleme yapılmadığından emin olun
        return jobAdvs;

>>>>>>> features2-login
    }

    @PostMapping("/filterJobAdv")
    public ResponseEntity<List<JobAdv>> filterJobAdv(@RequestBody FilterDto filterDto) {
<<<<<<< HEAD
        try {
            // FilterDto null ise boş bir nesne oluştur
            if (filterDto == null) {
                filterDto = new FilterDto();
            }
            
            List<JobAdv> filteredJobAdvs = jobAdvService.filter(
                    filterDto.getJobPositionIds(),
                    filterDto.getWorkTypes(),
                    filterDto.getMinSalary(),
                    filterDto.getMaxSalary(),
                    filterDto.getCities(),
                    filterDto.getCountries(),
                    filterDto.getCompanyIds()
            );
            return ResponseEntity.ok(filteredJobAdvs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/applyJobAdv/{id}")
    public ResponseEntity<String> applyJobAdv(@RequestHeader("Authorization") String token, @PathVariable("id") Integer id) {
        String email = jwtService.extractEmail(token.replace("Bearer ", ""));
        jobAdvService.applyForJob(id, email);
=======
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

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
    public ResponseEntity<String> applyJobAdv( @PathVariable("id") Integer id) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();
        candidateService.applyToJobAdv(email, id);
>>>>>>> features2-login
        return ResponseEntity.ok("Başvuru başarılı!");
    }




}
