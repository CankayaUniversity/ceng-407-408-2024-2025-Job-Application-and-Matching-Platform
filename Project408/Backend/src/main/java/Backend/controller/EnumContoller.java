package Backend.controller;

import Backend.core.enums.*;
import Backend.entities.user.candidate.Candidate;
import Backend.services.EnumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/enum")
public class EnumContoller {

    @Autowired
    EnumService enumService;

    @GetMapping("/applicationStatus")
    public ResponseEntity<ApplicationStatus> getApplicationStatus() {
        return ResponseEntity.ok(enumService.getApplicationStatus());
    }
    @GetMapping("/benefitType")
    public ResponseEntity<BenefitType> getBenefitType() {
        return ResponseEntity.ok(enumService.getBenefitType());
    }
    @GetMapping("/degreeType")
    public ResponseEntity<DegreeType> getDegreeType() {
        return ResponseEntity.ok(enumService.getDegreeType());
    }

    @GetMapping("/disabilityStatus")
    public ResponseEntity<DisabilityStatus> getDisabilityStatus() {
        return ResponseEntity.ok(enumService.getDisabilityStatus());
    }

    @GetMapping("/documentCategory")
    public ResponseEntity<DocumentCategory> getDocumentCategory() {
        return ResponseEntity.ok(enumService.getDocumentCategory());
    }

    @GetMapping("/employmentType")
    public ResponseEntity<EmploymentType> getEmploymentType() {
        return ResponseEntity.ok(enumService.getEmploymentType());
    }

    @GetMapping("/gender")
    public ResponseEntity<Gender> getGender() {
        return ResponseEntity.ok(enumService.getGender());
    }

    @GetMapping("/jobAdvStatus")
    public ResponseEntity<JobAdvStatus> getJobAdvStatus() {
        return ResponseEntity.ok(enumService.getJobAdvStatus());
    }

    @GetMapping("/jobExperience")
    public ResponseEntity<JobExperience> getJobExperience() {
        return ResponseEntity.ok(enumService.getJobExperience());
    }

    @GetMapping("/jobPosition")
    public ResponseEntity<JobPosition> getJobPosition() {
        return ResponseEntity.ok(enumService.getJobPosition());
    }

    @GetMapping("/languageLevel")
    public ResponseEntity<LanguageLevel> getLanguageLevel() {
        return ResponseEntity.ok(enumService.getLanguageLevel());
    }

    @GetMapping("/maritalStatus")
    public ResponseEntity<MaritalStatus> getMaritalStatus() {
        return ResponseEntity.ok(enumService.getMaritalStatus());
    }

    @GetMapping("/militaryStatus")
    public ResponseEntity<MilitaryStatus> getMilitaryStatus() {
        return ResponseEntity.ok(enumService.getMilitaryStatus());
    }

    @GetMapping("/nationality")
    public ResponseEntity<Nationality> getNationality() {
        return ResponseEntity.ok(enumService.getNationality());
    }

    @GetMapping("/offerStatus")
    public ResponseEntity<OfferStatus> getOfferStatus() {
        return ResponseEntity.ok(enumService.getOfferStatus());
    }

    @GetMapping("/projectStatus")
    public ResponseEntity<ProjectStatus> getProjectStatus() {
        return ResponseEntity.ok(enumService.getProjectStatus());
    }

    @GetMapping("/skillLevel")
    public ResponseEntity<SkillLevel> getSkillLevel() {
        return ResponseEntity.ok(enumService.getSkillLevel());
    }

    @GetMapping("/userType")
    public ResponseEntity<UserType> getUserType() {
        return ResponseEntity.ok(enumService.getUserType());
    }

    @GetMapping("/workType")
    public ResponseEntity<WorkType> getWorkType() {
        return ResponseEntity.ok(enumService.getWorkType());
    }






}
