package Backend.repository;

import Backend.entities.common.ReportedUser;
import Backend.entities.common.ReportStatus;
import Backend.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ReportedUserRepository extends JpaRepository<ReportedUser, Integer> {
    List<ReportedUser> findByReportedUser(User user);

    @Query("SELECT r.status, COUNT(r) FROM ReportedUser r GROUP BY r.status")
    List<Object[]> countByStatus(); // Returns List of [ReportStatus, Long]
} 