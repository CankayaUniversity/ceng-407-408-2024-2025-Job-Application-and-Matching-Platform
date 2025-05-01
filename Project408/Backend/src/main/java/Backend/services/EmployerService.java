package Backend.services;

import Backend.entities.company.Company;
import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.repository.CompanyRepository;
import Backend.repository.EmployerRepository;
import Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.HashMap;
import java.util.List;

@Service
public class EmployerService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    private EmployerRepository employerRepository;
    @Autowired
    private CompanyRepository companyRepository;

    public Company getProfileDetails(@PathVariable("id") int id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(!(user instanceof Employer employer)){
            throw new RuntimeException("User is not Employer");
        }

        return employer.getCompany();

    }
}
