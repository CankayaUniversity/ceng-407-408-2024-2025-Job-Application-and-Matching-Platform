package Backend.repository;

import Backend.entities.blog.Blog;
import Backend.entities.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {
    Page<Blog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Blog> findTop5ByOrderByCreatedAtDesc();
    List<Blog> findByAuthorOrderByCreatedAtDesc(User author);
} 