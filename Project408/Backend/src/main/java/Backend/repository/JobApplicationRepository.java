package Backend.repository;

import Backend.entities.user.candidate.JobApplication;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.candidate.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Integer> {
    List<JobApplication> findByJobAdv(JobAdv jobAdv);
    boolean existsByCandidateAndJobAdv(Candidate candidate, JobAdv jobAdv);

    List<JobApplication> findByCandidate(Candidate user);

    JobApplication findByJobAdvAndCandidate(JobAdv jobAdv, Candidate candidate);
}
