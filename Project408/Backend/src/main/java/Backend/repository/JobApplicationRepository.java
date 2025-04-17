package Backend.repository;

import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    List<JobApplication> findByCandidate(Candidate user);
}
