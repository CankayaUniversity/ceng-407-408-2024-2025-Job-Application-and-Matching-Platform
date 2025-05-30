package Backend.controller;

import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.entities.common.*;
import Backend.entities.dto.*;
import Backend.entities.jobAdv.*;
import Backend.entities.user.User;
import Backend.entities.user.candidate.*;
import Backend.repository.*;
import Backend.services.CandidateService;
import Backend.services.JobAdvService;
import Backend.services.JobApplicationService;
import Backend.services.JwtService;
import jakarta.persistence.Column;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
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
    @Autowired
    private ReportedJobRepository reportedJobRepository;
    @Autowired
    private ReportedUserRepository reportedUserRepository;

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
    public ResponseEntity<CandidateProfileDto> getProfile(@PathVariable("id") int id) {
        Candidate profile = candidateRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(candidateService.getProfile(profile));

    }
    @GetMapping("/profileDetail/{id}")
    public ResponseEntity<Map<String, Object>> getProfileDetails(@PathVariable("id") int id) {
        Candidate profile = candidateRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(candidateService.getProfileDetails(profile));

    }
    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file,
                                                       @RequestParam("userId") Integer userId) throws IOException {
        String fileName = "user" + userId + "-profile-" + UUID.randomUUID() + "." +
                FilenameUtils.getExtension(file.getOriginalFilename());

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "/uploads/" + fileName;

        Candidate candidate = candidateRepository.findById(userId).orElseThrow();


        ProfileDetails profileDetails = candidate.getProfileDetails();

        if (profileDetails == null) {
            profileDetails = new ProfileDetails();
            candidate.setProfileDetails(profileDetails);
        }

        profileDetails.setProfilePicture(fileUrl);


        candidateRepository.save(candidate);
        return ResponseEntity.ok(fileUrl);
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


    // Profil güncelleme
    @PutMapping("/updateProfile")
    public ResponseEntity<Candidate> updateProfile( @RequestBody CandidateProfileDto candidate) {
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
        List<JobAdv> jobAdvs =  jobAdvRepository.findAll();
        // Gereksiz filtreleme veya düzenleme yapılmadığından emin olun
        List<JobAdvDto> jobAdvDtos = jobAdvs.stream()
                .filter(jobAdv -> jobAdv.isActive() && jobAdv.getCreatedEmployer() != null && jobAdv.getCreatedEmployer().isActive())
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
                        if (jobCondition.getCity() != null) {
                            City country = jobCondition.getCity();
                            dto.setCity(jobCondition.getCity().getName());
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
                                .map(skill -> {
                                    TechnicalSkill tech= new TechnicalSkill();
                                    tech.setPositionName(skill.getPositionName());
                                    tech.setSkillLevel(skill.getSkillLevel());
                                    tech.setDescription(skill.getDescription());
                                    return tech;
                                })  // TechnicalSkill'in ismi alınır (örneğin: "Java")
                                .collect(Collectors.toList()));

                        dto.setSocialSkills(jobQualification.getSocialSkills().stream()
                                .map(skill -> {
                                    SocialSkill tech= new SocialSkill();
                                    tech.setPositionName(skill.getPositionName());
                                    tech.setSkillLevel(skill.getSkillLevel());
                                    tech.setDescription(skill.getDescription());
                                    return tech;
                                })
                                .collect(Collectors.toList()));

                        dto.setLanguageProficiencies(
                                jobQualification.getLanguageProficiencies().stream()
                                        .map(lang -> {
                                            LanguageProficiency langDto = new LanguageProficiency();
                                            langDto.setLanguage(lang.getLanguage());
                                            langDto.setReadingLevel(lang.getReadingLevel());
                                            langDto.setWritingLevel(lang.getWritingLevel());
                                            langDto.setSpeakingLevel(lang.getSpeakingLevel());
                                            langDto.setListeningLevel(lang.getListeningLevel());
                                            return langDto;
                                        })
                                        .collect(Collectors.toList())
                        );
                    }
                    if (jobAdv.getBenefits() != null) {
                        dto.setBenefitTypes( jobAdv.getBenefits().stream()
                                .map(benefit -> {
                                    Benefit b = new Benefit();
                                    b.setBenefitType(benefit.getBenefitType());
                                    b.setDescription(benefit.getDescription());
                                    return b;
                                }) // BenefitType enum'u string'e çeviriyoruz
                                .collect(Collectors.toList())
                        );

                    }

                    if (jobAdv.getJobPositions() != null) {
                        dto.setJobPositions( jobAdv.getJobPositions().stream()
                                .map(position -> {
                                    JobPositions positions= new JobPositions();
                                    positions.setPositionType(position.getPositionType());
                                    positions.setCustomJobPosition(position.getCustomJobPosition());
                                    return positions;
                                })
                                .collect(Collectors.toList())
                        );


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
            if (jobAdv.isActive() && jobAdv.getCreatedEmployer().isActive()) {
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
                            .map(skill -> {
                                TechnicalSkill tech = new TechnicalSkill();
                                tech.setPositionName(skill.getPositionName());
                                tech.setSkillLevel(skill.getSkillLevel());
                                tech.setDescription(skill.getDescription());
                                return tech;
                            })  // TechnicalSkill'in ismi alınır (örneğin: "Java")
                            .collect(Collectors.toList()));

                    dto.setSocialSkills(jobQualification.getSocialSkills().stream()
                            .map(skill -> {
                                SocialSkill tech = new SocialSkill();
                                tech.setPositionName(skill.getPositionName());
                                tech.setSkillLevel(skill.getSkillLevel());
                                tech.setDescription(skill.getDescription());
                                return tech;
                            })
                            .collect(Collectors.toList()));

                    dto.setLanguageProficiencies(
                            jobQualification.getLanguageProficiencies().stream()
                                    .map(lang -> {
                                        LanguageProficiency langDto = new LanguageProficiency();
                                        langDto.setLanguage(lang.getLanguage());
                                        langDto.setReadingLevel(lang.getReadingLevel());
                                        langDto.setWritingLevel(lang.getWritingLevel());
                                        langDto.setSpeakingLevel(lang.getSpeakingLevel());
                                        langDto.setListeningLevel(lang.getListeningLevel());
                                        return langDto;
                                    })
                                    .collect(Collectors.toList())
                    );
                }

                if (jobAdv.getBenefits() != null) {
                    dto.setBenefitTypes(jobAdv.getBenefits().stream()
                            .map(benefit -> {
                                Benefit b = new Benefit();
                                b.setBenefitType(benefit.getBenefitType());
                                b.setDescription(benefit.getDescription());
                                return b;
                            }) // BenefitType enum'u string'e çeviriyoruz
                            .collect(Collectors.toList())
                    );

                }
                if (jobAdv.getJobPositions() != null) {
                    dto.setJobPositions(jobAdv.getJobPositions().stream()
                            .map(position -> {
                                JobPositions positions = new JobPositions();
                                positions.setPositionType(position.getPositionType());
                                positions.setCustomJobPosition(position.getCustomJobPosition());
                                return positions;
                            })
                            .collect(Collectors.toList())
                    );

                }


                jobAdvDtos.add(dto);
            }
        }

        return jobAdvDtos;
    }
    @PostMapping("/report/{jobId}")
    public ResponseEntity<?> reportJob(@PathVariable Integer jobId, @RequestBody ReportRequestDto reportReason) {
        try {
            JobAdv jobadv = jobAdvRepository.findById(jobId).orElseThrow(()-> new RuntimeException("Job Adv not found"));

            String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            User reporter = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

            ReportedJob job = new ReportedJob();
            job.setJobAdv(jobadv);
            job.setReporter(reporter);
            job.setReason(reportReason.getReason());
            job.setStatus(ReportStatus.PENDING);

            reportedJobRepository.save(job);

            return ResponseEntity.ok("Report submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/report-user/{jobId}")
    public ResponseEntity<?> reportUser(@PathVariable Integer jobId, @RequestBody ReportRequestDto reportReason) {
        try {
            User user = userRepository.findById(jobId).orElseThrow(()-> new RuntimeException("User not found"));

            String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();

            User reporter = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

            ReportedUser reportedUser = new ReportedUser();
            reportedUser.setReportedUser(user);
            reportedUser.setReporter(reporter);
            reportedUser.setReason(reportReason.getReason());
            reportedUser.setStatus(ReportStatus.PENDING);

            reportedUserRepository.save(reportedUser);

            return ResponseEntity.ok("Report submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }





}
