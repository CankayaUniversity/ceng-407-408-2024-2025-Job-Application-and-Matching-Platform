package Backend.services;

import Backend.entities.company.Company;
import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.repository.CompanyRepository;
import Backend.repository.EmployerRepository;
import Backend.repository.UserRepository;
import org.springframework.beans.BeanUtils;
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

    public HashMap<Object,Object>  getProfileDetails(@PathVariable("id") int id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(!(user instanceof Employer employer)){
            throw new RuntimeException("User is not Employer");
        }
        HashMap<Object,Object> emp= new HashMap<>();
        emp.put("employerName",employer.getFirstName());
        emp.put("employerLastName",employer.getLastName());
        emp.put("company",employer.getCompany());

        return emp;

    }


    public  Company updateProfile(int id,Company company) {

        Employer emp= employerRepository.findCompanyById(id);
        Company cmp= companyRepository.findById(company.getId()).get();
        BeanUtils.copyProperties(company,cmp);

         companyRepository.save(cmp);

         return cmp;
    }
}
