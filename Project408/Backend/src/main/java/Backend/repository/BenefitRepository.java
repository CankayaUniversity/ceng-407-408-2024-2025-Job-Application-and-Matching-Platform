package Backend.repository;

import Backend.entities.jobAdv.Benefit;
import Backend.entities.jobAdv.JobQualification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BenefitRepository extends JpaRepository<Benefit, Integer> {
}
