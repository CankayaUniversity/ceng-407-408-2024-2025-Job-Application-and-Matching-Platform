package Backend.repository;

import Backend.core.location.City;
import Backend.core.location.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {
    List<City> findByCountryId(int country_id);

    List<City> findByCountry(Country turkey);

    City findByName(String name);
}
