package Backend.services;

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
                .flatMap(app -> app.getOffers().stream())  // İş tekliflerini düzleştir
                .map(jobOffer -> {
                    Map<String, Object> offerDetails = new HashMap<>();
                    offerDetails.put("jobOffer", jobOffer);
                    offerDetails.put("company", jobOffer.getEmployer().getCompany());
                    return offerDetails;
                })
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