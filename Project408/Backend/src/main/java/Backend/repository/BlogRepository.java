package Backend.repository;

import Backend.entities.common.Blog;
import Backend.entities.user.candidate.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlogRepository extends JpaRepository<Blog, Integer> {
}
