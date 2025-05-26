package Backend.repository;

import Backend.entities.offer.Interviews;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.JobApplication;
import Backend.entities.user.employer.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interviews, Integer> {

    List<Interviews> findByCandidate(Candidate candidate);

    List<Interviews> findByEmployer(Employer employer);

    Interviews findByJobApplicationAndCandidate(JobApplication jobApplication, Candidate candidate);
}
