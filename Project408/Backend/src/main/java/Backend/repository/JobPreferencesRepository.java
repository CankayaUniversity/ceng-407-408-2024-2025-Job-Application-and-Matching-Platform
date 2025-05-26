package Backend.repository;

import Backend.entities.user.candidate.JobPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPreferencesRepository extends JpaRepository<JobPreferences, Integer> {
}
