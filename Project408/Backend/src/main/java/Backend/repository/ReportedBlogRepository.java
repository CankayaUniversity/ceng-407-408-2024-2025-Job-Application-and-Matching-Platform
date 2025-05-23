package Backend.repository;

import Backend.entities.common.ReportedBlog;
import Backend.entities.common.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportedBlogRepository extends JpaRepository<ReportedBlog, Integer> {
    List<ReportedBlog> findByBlogId(Integer blogId);

    @Query("SELECT r.status, COUNT(r) FROM ReportedBlog r GROUP BY r.status")
    List<Object[]> countByStatus();
} 