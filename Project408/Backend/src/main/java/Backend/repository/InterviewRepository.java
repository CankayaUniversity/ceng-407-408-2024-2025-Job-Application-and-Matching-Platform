package Backend.repository;

import Backend.entities.offer.Interviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends JpaRepository<Interviews, Integer> {
}
