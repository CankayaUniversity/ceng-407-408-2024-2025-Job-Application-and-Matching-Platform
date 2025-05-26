package Backend.repository;

import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Integer> {
}
