package Backend.controller;

import Backend.core.location.Country;
import Backend.entities.dto.CandidateProfileDto;
import Backend.entities.dto.FilterDto;
import Backend.entities.dto.JobAdvDto;
import Backend.entities.dto.ReferenceDto;
import Backend.entities.jobAdv.Benefit;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.jobAdv.JobCondition;
import Backend.entities.jobAdv.JobQualification;
import Backend.entities.user.User;
import Backend.entities.user.candidate.*;
import Backend.repository.CandidateRepository;
import Backend.repository.JobAdvRepository;
import Backend.services.CandidateService;
import Backend.services.JobAdvService;
import Backend.services.JobApplicationService;
import Backend.services.JwtService;
import Backend.repository.UserRepository;
import jakarta.persistence.Column;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/candidate")

public class CandidateController {

     private final  CandidateService candidateService;

    @Autowired
    JwtService jwtService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    JobAdvService jobAdvService;

    @Autowired
    JobApplicationService jobApplicationService;
    @Autowired
    private JobAdvRepository jobAdvRepository;
    @Autowired
    private CandidateRepository candidateRepository;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/userName/{id}")
    public ResponseEntity<Map<String, String>> getUserName(@PathVariable("id") int id) {
        User profile = userRepository.findById(id).get();
        Map<String, String> userName = new HashMap<>();
        userName.put("userName", profile.getFirstName() + " " + profile.getLastName());
        return ResponseEntity.ok(userName);

    }
    @GetMapping("/profile/{id}")
    public ResponseEntity<Candidate> getProfile(@PathVariable("id") int id) {
        Candidate profile = candidateRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(profile);

    }
    @GetMapping("/profileDetails/{id}")
    public ResponseEntity<ProfileDetails> getProfiles(@PathVariable("id") int id) {
        ProfileDetails profile = candidateService.getProfileByUserId(id);
        return ResponseEntity.ok(profile);
    }
    @GetMapping("/socialLinks/{id}")
    public ResponseEntity<SocialLinks> socialLinks(@PathVariable("id") int id) {
        SocialLinks socialLinks = candidateService.getSocialLinksByUserId(id);
        return ResponseEntity.ok(socialLinks);
    }
    @GetMapping("/contactInformation/{id}")
    public ResponseEntity<ContactInformation> contactInformation(@PathVariable("id") int id) {
        ContactInformation contactInformation = candidateService.getContactInformationByUserId(id);
        return ResponseEntity.ok(contactInformation);
    }
    @GetMapping("/jobPreferences/{id}")
    public ResponseEntity<JobPreferences> jobPreferences(@PathVariable("id") int id) {
        JobPreferences profile = candidateService.getJobPreferencesByUserId(id);
        return ResponseEntity.ok(profile);
    }


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
    public List<JobAdvDto> getAllJobAdv() {
        List<JobAdv> jobAdvs = jobAdvService.getAllJobAdv();
        // Gereksiz filtreleme veya düzenleme yapılmadığından emin olun
        List<JobAdvDto> jobAdvDtos = jobAdvs.stream()
                .map(jobAdv -> {
                    JobAdvDto dto = new JobAdvDto();
                    dto.setId(jobAdv.getId());
                    dto.setDescription(jobAdv.getDescription());
                    dto.setCompanyName(jobAdv.getCompany().getCompanyName());
                    dto.setMinSalary(jobAdv.getMinSalary());
                    dto.setMaxSalary(jobAdv.getMaxSalary());
                    dto.setLastDate(jobAdv.getLastDate());
                    dto.setTravelRest(jobAdv.isTravelRest());
                    dto.setLicense(jobAdv.isLicense());

                    if (jobAdv.getJobCondition() != null) {
                        JobCondition jobCondition = jobAdv.getJobCondition();

                        dto.setWorkType(jobCondition.getWorkType());
                        dto.setEmploymentType(jobCondition.getEmploymentType());
                        if(jobCondition.getCountry() != null){
                            Country country = jobCondition.getCountry();
                            dto.setCountry(jobCondition.getCountry().getName());
                        }
                        dto.setMinWorkHours(jobCondition.getMinWorkHours());
                        dto.setMaxWorkHours(jobCondition.getMaxWorkHours());
                    }

                    if (jobAdv.getJobQualification() != null) {
                        JobQualification jobQualification = jobAdv.getJobQualification();

                        dto.setDegreeType(jobQualification.getDegreeType().toString());
                        dto.setJobExperience(jobQualification.getJobExperience().toString());
                        dto.setExperienceYears(jobQualification.getExperienceYears());
                        dto.setMilitaryStatus(jobQualification.getMilitaryStatus().toString());

                        // Teknik ve sosyal becerileri alıyoruz
                        dto.setTechnicalSkills(jobQualification.getTechnicalSkills().stream()
                                .map(skill -> skill.getPositionName())  // TechnicalSkill'in ismi alınır (örneğin: "Java")
                                .collect(Collectors.toList()));

                        dto.setSocialSkills(jobQualification.getSocialSkills().stream()
                                .map(skill -> skill.getPositionName())  // SocialSkill'in ismi alınır (örneğin: "Takım Çalışması")
                                .collect(Collectors.toList()));

                        dto.setLanguageProficiencies(jobQualification.getLanguageProficiencies().stream()
                                .map(lang -> lang.getLanguage())  // LanguageProficiency'den dil isimleri alınır
                                .collect(Collectors.toList()));
                    }
                    if (jobAdv.getBenefits() != null) {
                        List<String> benefitTypes = jobAdv.getBenefits().stream()
                                .map(benefit -> benefit.getBenefitType().toString()) // BenefitType enum'u string'e çeviriyoruz
                                .collect(Collectors.toList());

                        List<String> benefitDescriptions = jobAdv.getBenefits().stream()
                                .map(Benefit::getDescription)  // Benefit description'ı alıyoruz
                                .collect(Collectors.toList());

                        dto.setBenefitTypes(benefitTypes);
                        dto.setBenefitDescriptions(benefitDescriptions);
                    }

                    if (jobAdv.getJobPositions() != null) {
                        List<String> positionTypes = jobAdv.getJobPositions().stream()
                                .map(jobPosition -> jobPosition.getPositionType().toString())  // PositionType enum'unu string'e çeviriyoruz
                                .collect(Collectors.toList());

                        List<String> customJobPositions = jobAdv.getJobPositions().stream()
                                .filter(jobPosition -> jobPosition.getCustomJobPosition() != null)
                                .map(jobPosition -> jobPosition.getCustomJobPosition().getPositionName()) // CustomJobPosition isimleri
                                .collect(Collectors.toList());

                        dto.setPositionTypes(positionTypes);
                        dto.setCustomJobPositions(customJobPositions);
                    }


                    return dto;
                })
                .collect(Collectors.toList());

        return jobAdvDtos;

    }

    @PostMapping("/filterJobAdv")
    public ResponseEntity<List<JobAdv>> filterJobAdv(@RequestBody FilterDto filterDto) {
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
        return ResponseEntity.ok("Başvuru başarılı!");
    }

    @GetMapping("/myApplications")
    public ResponseEntity<List<Map<String, Object>>> getMyApplications() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = userDetails.getUsername();

        List<JobApplication> applications = candidateService.getJobApplicationsByEmail(email);

        List<Map<String, Object>> statusList = applications.stream()
                .map(app -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("jobAdvId", app.getJobAdv().getId());
                    map.put("status", app.getStatus().name());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(statusList);

    }

    @GetMapping("/getMyApplicationsDetails/{id}")
    public List<JobAdvDto> getMyApplicationsDetails(@PathVariable("id") Integer id) {
        List<JobApplication> myApplications = jobApplicationService.findMyApplications(id);
        List<JobAdvDto> jobAdvDtos = new ArrayList<>();

        for (JobApplication jobApplication : myApplications) {
            JobAdv jobAdv = jobApplication.getJobAdv();

            JobAdvDto dto = new JobAdvDto();
            dto.setId(jobAdv.getId());
            dto.setDescription(jobAdv.getDescription());
            dto.setCompanyName(jobAdv.getCompany().getCompanyName());
            dto.setMinSalary(jobAdv.getMinSalary());
            dto.setMaxSalary(jobAdv.getMaxSalary());
            dto.setLastDate(jobAdv.getLastDate());
            dto.setTravelRest(jobAdv.isTravelRest());
            dto.setLicense(jobAdv.isLicense());

            if (jobAdv.getJobCondition() != null) {
                JobCondition jobCondition = jobAdv.getJobCondition();
                dto.setWorkType(jobCondition.getWorkType());
                dto.setEmploymentType(jobCondition.getEmploymentType());
                if (jobCondition.getCountry() != null) {
                    dto.setCountry(jobCondition.getCountry().getName());
                }
                dto.setMinWorkHours(jobCondition.getMinWorkHours());
                dto.setMaxWorkHours(jobCondition.getMaxWorkHours());
            }

            if (jobAdv.getJobQualification() != null) {
                JobQualification jobQualification = jobAdv.getJobQualification();
                dto.setDegreeType(jobQualification.getDegreeType().toString());
                dto.setJobExperience(jobQualification.getJobExperience().toString());
                dto.setExperienceYears(jobQualification.getExperienceYears());
                dto.setMilitaryStatus(jobQualification.getMilitaryStatus().toString());

                dto.setTechnicalSkills(jobQualification.getTechnicalSkills().stream()
                        .map(skill -> skill.getPositionName())
                        .collect(Collectors.toList()));

                dto.setSocialSkills(jobQualification.getSocialSkills().stream()
                        .map(skill -> skill.getPositionName())
                        .collect(Collectors.toList()));

                dto.setLanguageProficiencies(jobQualification.getLanguageProficiencies().stream()
                        .map(lang -> lang.getLanguage())
                        .collect(Collectors.toList()));
            }

            if (jobAdv.getBenefits() != null) {
                List<String> benefitTypes = jobAdv.getBenefits().stream()
                        .map(benefit -> benefit.getBenefitType().toString())
                        .collect(Collectors.toList());
                List<String> benefitDescriptions = jobAdv.getBenefits().stream()
                        .map(Benefit::getDescription)
                        .collect(Collectors.toList());

                dto.setBenefitTypes(benefitTypes);
                dto.setBenefitDescriptions(benefitDescriptions);
            }

            if (jobAdv.getJobPositions() != null) {
                List<String> positionTypes = jobAdv.getJobPositions().stream()
                        .map(jobPosition -> jobPosition.getPositionType().toString())
                        .collect(Collectors.toList());

                List<String> customJobPositions = jobAdv.getJobPositions().stream()
                        .filter(jobPosition -> jobPosition.getCustomJobPosition() != null)
                        .map(jobPosition -> jobPosition.getCustomJobPosition().getPositionName())
                        .collect(Collectors.toList());

                dto.setPositionTypes(positionTypes);
                dto.setCustomJobPositions(customJobPositions);
            }

            jobAdvDtos.add(dto);
        }

        return jobAdvDtos;
    }




}
