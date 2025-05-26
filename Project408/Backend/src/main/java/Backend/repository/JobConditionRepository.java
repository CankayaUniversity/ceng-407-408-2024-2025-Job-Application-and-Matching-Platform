package Backend.repository;

import Backend.entities.jobAdv.JobCondition;
import Backend.entities.user.candidate.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobConditionRepository extends JpaRepository<JobCondition, Integer> {
}
