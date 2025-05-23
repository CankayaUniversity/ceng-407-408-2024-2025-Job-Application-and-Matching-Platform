package Backend.repository;

import Backend.entities.common.ReportedUser;
import Backend.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportedUserRepository extends JpaRepository<ReportedUser, Integer> {
    List<ReportedUser> findByReportedUser(User user);
} 