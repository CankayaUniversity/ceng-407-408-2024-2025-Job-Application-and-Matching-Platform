package Backend.controller;

import Backend.core.location.City;
import Backend.core.location.Country;
import Backend.repository.CityRepository;
import Backend.repository.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/location")

public class LocationController {

    @Autowired
    CityRepository cityRepository;
    @Autowired
    CountryRepository countryRepository;

    @GetMapping("/countries")
    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    @GetMapping("/cities/{selectedCountryId}")
    public List<City> getCitiesByCountry(@PathVariable("selectedCountryId") int countryId) {
        return cityRepository.findByCountryId(countryId);
    }
}
