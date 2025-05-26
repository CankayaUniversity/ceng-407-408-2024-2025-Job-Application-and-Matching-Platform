package Backend.services;

import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobApplication;
import Backend.repository.JobApplicationRepository;
import Backend.repository.JobPositionsRepository;
import Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final UserRepository userRepository;

    public JobApplicationService(JobPositionsRepository jobPositionsRepository, JobApplicationRepository jobApplicationRepository, UserRepository userRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.userRepository = userRepository;
    }

    public List<JobApplication> findMyApplications(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (!(user instanceof Candidate)) {
            throw new RuntimeException("User is not a Candidate");
        }
        Candidate cnd = (Candidate) user;

        return jobApplicationRepository.findByCandidate(cnd);
    }
}
