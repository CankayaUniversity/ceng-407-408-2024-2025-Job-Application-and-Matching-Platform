package Backend.repository;

import Backend.entities.common.LanguageProficiency;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LanguageProficiencyRepository extends JpaRepository<LanguageProficiency, Integer> {
        List<LanguageProficiency> findByLanguage(String language);

}
