package Backend.repository;

import Backend.entities.company.Company;
import Backend.entities.user.employer.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<Employer, Integer> {
    Optional<Employer> findByEmail(String email);

    Employer findCompanyById(int id);


}
