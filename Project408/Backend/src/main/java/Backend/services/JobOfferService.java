package Backend.services;

import Backend.entities.offer.JobOffer;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobApplication;
import Backend.repository.CandidateRepository;
import Backend.repository.JobOfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;
    private final CandidateRepository candidateRepository;

    public List<JobOffer> getMyOffers(String candidateEmail) {
        Candidate candidate = candidateRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("Aday bulunamadı: " + candidateEmail));

        // Adayın tüm başvurularını al
        List<JobApplication> applications = candidate.getJobApplications();
        
        // Tüm başvurularındaki teklifleri birleştir
        return applications.stream()
                .flatMap(app -> app.getOffers().stream())
                .collect(Collectors.toList());
    }
} 