package Backend.repository;

import Backend.entities.blog.Blog;
import Backend.entities.blog.Comment;
import Backend.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByBlogOrderByCreatedAtDesc(Blog blog);
    int countByBlog(Blog blog);
    List<Comment> findByAuthorOrderByCreatedAtDesc(User author);
} 