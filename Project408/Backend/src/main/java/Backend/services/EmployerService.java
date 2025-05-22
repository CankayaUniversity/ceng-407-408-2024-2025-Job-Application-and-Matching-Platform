package Backend.services;

import Backend.entities.common.Project;
import Backend.entities.company.Company;
import Backend.entities.dto.PasswordChangeDto;
import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.repository.CompanyRepository;
import Backend.repository.EmployerRepository;
import Backend.repository.ProjectRepository;
import Backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmployerService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    private EmployerRepository employerRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

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


    @Transactional
    public Company updateProfile(int id, Company company) {
        Employer emp = employerRepository.findCompanyById(id);

        Company cmp = companyRepository.findById(company.getId()).orElse(new Company());

        cmp.setCompanyName(company.getCompanyName());
        cmp.setEmail(company.getEmail());
        cmp.setPhoneNumber(company.getPhoneNumber());
        cmp.setWebsiteUrl(company.getWebsiteUrl());
        cmp.setVision(company.getVision());
        cmp.setMission(company.getMission());
        cmp.setEstablishedDate(company.getEstablishedDate());
        cmp.setIndustry(company.getIndustry());
        cmp.setEmployeeCount(company.getEmployeeCount());

        companyRepository.save(cmp);

        if (company.getProjects() != null) {
            List<Project> updatedProjects = new ArrayList<>();

            List<Project> existingProjects = projectRepository.findByCompanyId(cmp.getId());

            Set<Integer> updatedProjectIds = company.getProjects().stream()
                    .filter(p -> p.getId() != 0)
                    .map(Project::getId)
                    .collect(Collectors.toSet());

            for (Project oldProject : existingProjects) {
                if (!updatedProjectIds.contains(oldProject.getId())) {
                    projectRepository.delete(oldProject);
                }
            }


            for (Project p : company.getProjects()) {
                if (p.getId() != 0) {
                    Project existingProject = projectRepository.findById(p.getId()).orElse(new Project());
                    existingProject.setProjectName(p.getProjectName());
                    existingProject.setProjectDescription(p.getProjectDescription());
                    existingProject.setProjectStartDate(p.getProjectStartDate());
                    existingProject.setProjectEndDate(p.getProjectEndDate());
                    existingProject.setProjectStatus(p.getProjectStatus());
                    existingProject.setIsPrivate(p.getIsPrivate());
                    existingProject.setCompany(cmp);

                    updatedProjects.add(existingProject);
                } else {
                    p.setCompany(cmp);
                    updatedProjects.add(p);
                }
            }

            projectRepository.saveAll(updatedProjects);
            cmp.setProjects(updatedProjects);
        }


        companyRepository.save(cmp);

        emp.setCompany(cmp);
        employerRepository.save(emp);

        return cmp;
    }

    public void changePassword(PasswordChangeDto dto, String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
            userRepository.save(user);
        }

        else{
            throw new RuntimeException("Something went wrong!");
        }
    }

    public void deleteAccount(String email) {
        User user= userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not found"));
        if(user.isEnabled() && user.isActive()){
            user.setEnabled(false);
            user.setActive(false);
            userRepository.save(user);

//            userRepository.delete(user);
        }
    }
}
