package Backend.repository;

import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationRepository extends JpaRepository<Education, Integer> {
}
