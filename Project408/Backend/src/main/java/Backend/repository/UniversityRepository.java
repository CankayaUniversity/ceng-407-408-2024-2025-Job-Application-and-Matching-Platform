package Backend.repository;

import Backend.core.location.City;
import Backend.core.location.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Integer> {
    List<University> findByCityIn(List<City> ankara);

    University findByName(String associateUniversityName);
}
