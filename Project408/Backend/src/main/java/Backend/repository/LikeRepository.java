package Backend.repository;

import Backend.entities.blog.Blog;
import Backend.entities.blog.Like;
import Backend.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    int countByBlog(Blog blog);
    Optional<Like> findByBlogAndUser(Blog blog, User user);
    boolean existsByBlogAndUser(Blog blog, User user);
    void deleteByBlogAndUser(Blog blog, User user);
} 