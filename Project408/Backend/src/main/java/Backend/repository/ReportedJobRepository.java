package Backend.repository;

import Backend.entities.common.ReportedJob;
import Backend.entities.common.ReportStatus;
import Backend.entities.jobAdv.JobAdv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportedJobRepository extends JpaRepository<ReportedJob, Integer> {
    List<ReportedJob> findByJobAdv(JobAdv jobAdv);

    @Query("SELECT r.status, COUNT(r) FROM ReportedJob r GROUP BY r.status")
    List<Object[]> countByStatus();
} 