package Backend.repository;

import Backend.entities.common.ReportedJob;
import Backend.entities.jobAdv.JobAdv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportedJobRepository extends JpaRepository<ReportedJob, Integer> {
    List<ReportedJob> findByJobAdv(JobAdv jobAdv);
} 