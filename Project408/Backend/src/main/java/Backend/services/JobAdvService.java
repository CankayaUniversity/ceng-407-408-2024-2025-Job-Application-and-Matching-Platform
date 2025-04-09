package Backend.services;

import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.candidate.Candidate;
import Backend.repository.CandidateRepository;
import Backend.repository.JobAdvRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class JobAdvService {

    @Autowired
    JobAdvRepository jobAdvRepository;

    public List<JobAdv> getAllJobAdv() {
        return jobAdvRepository.findAll();
    }

    public List<JobAdv> filter(List<Integer> jobPositionIds,List<String> workTypes,Double minSalary,Double maxSalary,List<String> cities,List<String> countries,List<Integer> companyIds) {
        return jobAdvRepository.filter(jobPositionIds, workTypes, minSalary, maxSalary, cities, countries, companyIds);
    }

    public JobAdv findJobAdvById(Integer id) {
        return jobAdvRepository.findById(id).orElseThrow();
    }
}
