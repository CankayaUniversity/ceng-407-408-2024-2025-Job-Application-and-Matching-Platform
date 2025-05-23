package Backend.repository;

import Backend.entities.common.ReportedBlog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportedBlogRepository extends JpaRepository<ReportedBlog, Integer> {
    List<ReportedBlog> findByBlogId(Integer blogId);
} 