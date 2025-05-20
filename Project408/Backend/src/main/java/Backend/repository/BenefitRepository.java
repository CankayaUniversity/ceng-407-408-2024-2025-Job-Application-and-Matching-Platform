package Backend.repository;

import Backend.entities.jobAdv.Benefit;
import Backend.entities.jobAdv.JobQualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BenefitRepository extends JpaRepository<Benefit, Integer> {
}
