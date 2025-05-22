package Backend.controller;

import Backend.entities.blog.Blog;
import Backend.entities.blog.Comment;
import Backend.entities.blog.Like;
import Backend.entities.user.User;
import Backend.repository.BlogRepository;
import Backend.repository.CommentRepository;
import Backend.repository.LikeRepository;
import Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/blogs")
@CrossOrigin(origins = "*")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all blogs with pagination
    @GetMapping
    public ResponseEntity<Page<Blog>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Blog> blogs = blogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return ResponseEntity.ok(blogs);
    }

    // Get a single blog by id
    @GetMapping("/{id}")
    public ResponseEntity<Blog> getBlogById(@PathVariable("id") Integer id) {
        Optional<Blog> blog = blogRepository.findById(id);
        return blog.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new blog
    @PostMapping
    public ResponseEntity<Blog> createBlog(@RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> userOptional = userRepository.findByEmail(currentUserEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        User user = userOptional.get();
        
        Blog blog = new Blog();
        blog.setTitle(request.get("title"));
        blog.setContent(request.get("content"));
        blog.setAuthor(user);
        
        Blog savedBlog = blogRepository.save(blog);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBlog);
    }

    // Add a comment to a blog
    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable("id") Integer id,
            @RequestBody Map<String, String> request) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> userOptional = userRepository.findByEmail(currentUserEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<Blog> blogOptional = blogRepository.findById(id);
        if (blogOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        Blog blog = blogOptional.get();
        
        Comment comment = new Comment();
        comment.setContent(request.get("content"));
        comment.setAuthor(user);
        comment.setBlog(blog);
        
        Comment savedComment = commentRepository.save(comment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
    }

    // Like a blog post
    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> likeBlog(@PathVariable("id") Integer id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication.getName();
        
        Optional<User> userOptional = userRepository.findByEmail(currentUserEmail);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        Optional<Blog> blogOptional = blogRepository.findById(id);
        if (blogOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        Blog blog = blogOptional.get();
        
        Map<String, Object> response = new HashMap<>();
        
        // Check if the like exists and toggle it
        if (likeRepository.existsByBlogAndUser(blog, user)) {
            Optional<Like> existingLike = likeRepository.findByBlogAndUser(blog, user);
            if (existingLike.isPresent()) {
                likeRepository.delete(existingLike.get());
            }
            response.put("liked", false);
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setBlog(blog);
            likeRepository.save(like);
            response.put("liked", true);
        }
        
        // Get the updated count of likes
        response.put("likesCount", likeRepository.countByBlog(blog));
        
        return ResponseEntity.ok(response);
    }
} 