package Backend.repository;

import Backend.entities.common.LanguageProficiency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LanguageProficiencyRepository extends JpaRepository<LanguageProficiency, Integer> {
}
