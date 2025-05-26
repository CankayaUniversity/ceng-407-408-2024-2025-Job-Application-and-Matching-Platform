package Backend.repository;

import Backend.entities.company.Company;
import Backend.entities.user.candidate.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {

}
