package Backend.repository;

import Backend.entities.jobAdv.JobCondition;
import Backend.entities.jobAdv.JobQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobQualificationRepository extends JpaRepository<JobQualification, Integer> {
}
