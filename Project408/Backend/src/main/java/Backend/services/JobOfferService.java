package Backend.services;

import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.entities.common.JobPositions;
import Backend.entities.common.LanguageProficiency;
import Backend.entities.dto.JobAdvDto;
import Backend.entities.jobAdv.*;
import Backend.entities.offer.JobOffer;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobApplication;
import Backend.entities.user.employer.Employer;
import Backend.repository.CandidateRepository;
import Backend.repository.EmployerRepository;
import Backend.repository.JobOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobOfferService {
    @Autowired
    JobOfferRepository jobOfferRepository;
    @Autowired
    CandidateRepository candidateRepository;
    @Autowired
    private EmployerRepository employerRepository;

    public List<Map<String, Object>> getMyOffers(String candidateEmail) {
        Candidate candidate = candidateRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Aday bulunamadı: " + candidateEmail));

        List<JobApplication> applications = candidate.getJobApplications();

        return applications.stream()
                .flatMap(app -> app.getOffers().stream()
                        .map(offer -> {
                            JobApplication application = offer.getApplication();
                            JobAdv jobAdv = application.getJobAdv();
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
                                if (jobCondition.getCity() != null) {
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
                                            TechnicalSkill tech = new TechnicalSkill();
                                            tech.setPositionName(skill.getPositionName());
                                            tech.setSkillLevel(skill.getSkillLevel());
                                            tech.setDescription(skill.getDescription());
                                            return tech;
                                        }).collect(Collectors.toList()));

                                dto.setSocialSkills(jobQualification.getSocialSkills().stream()
                                        .map(skill -> {
                                            SocialSkill social = new SocialSkill();
                                            social.setPositionName(skill.getPositionName());
                                            social.setSkillLevel(skill.getSkillLevel());
                                            social.setDescription(skill.getDescription());
                                            return social;
                                        }).collect(Collectors.toList()));

                                dto.setLanguageProficiencies(jobQualification.getLanguageProficiencies().stream()
                                        .map(lang -> {
                                            LanguageProficiency langDto = new LanguageProficiency();
                                            langDto.setLanguage(lang.getLanguage());
                                            langDto.setReadingLevel(lang.getReadingLevel());
                                            langDto.setWritingLevel(lang.getWritingLevel());
                                            langDto.setSpeakingLevel(lang.getSpeakingLevel());
                                            langDto.setListeningLevel(lang.getListeningLevel());
                                            return langDto;
                                        }).collect(Collectors.toList()));
                            }

                            if (jobAdv.getBenefits() != null) {
                                dto.setBenefitTypes(jobAdv.getBenefits().stream()
                                        .map(benefit -> {
                                            Benefit b = new Benefit();
                                            b.setBenefitType(benefit.getBenefitType());
                                            b.setDescription(benefit.getDescription());
                                            return b;
                                        }).collect(Collectors.toList()));
                            }

                            if (jobAdv.getJobPositions() != null) {
                                dto.setJobPositions(jobAdv.getJobPositions().stream()
                                        .map(position -> {
                                            JobPositions positions = new JobPositions();
                                            positions.setPositionType(position.getPositionType());
                                            positions.setCustomJobPosition(position.getCustomJobPosition());
                                            return positions;
                                        }).collect(Collectors.toList()));
                            }

                            Map<String, Object> result = new HashMap<>();
                            result.put("jobAdv", dto);
                            result.put("jobOffer", offer);

                            return result;
                        })
                )
                .collect(Collectors.toList());
    }



    public List<Map<String, Object>> getMyOffersEmp(String employerEmail) {
        Employer employer = employerRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new RuntimeException("Employer bulunamadı: " + employerEmail));

        List<JobOffer> offers = jobOfferRepository.findByEmployer(employer);

        return offers.stream()
                .map(offer -> {
                    Map<String, Object> offerDetails = new HashMap<>();

                    offerDetails.put("status", offer.getStatus());

                    JobApplication application = offer.getApplication();
                    if (application != null) {
                        offerDetails.put("candidate", application.getCandidate());
                    }

                    return offerDetails;
                })
                .collect(Collectors.toList());
    }




} 