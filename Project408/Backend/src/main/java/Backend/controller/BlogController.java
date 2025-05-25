package Backend.controller;

import Backend.entities.BaseEntity;
import Backend.entities.common.Blog;
import Backend.entities.common.ReportStatus;
import Backend.entities.common.ReportedBlog;
import Backend.entities.dto.BlogDto;
import Backend.entities.dto.BlogResponseDto;
import Backend.entities.dto.CommentDto;
import Backend.entities.dto.ReportRequestDto;
import Backend.entities.user.User;
import Backend.repository.BlogRepository;
import Backend.repository.ReportedBlogRepository;
import Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/blog")
public class BlogController {

    @Autowired
    private BlogRepository blogRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReportedBlogRepository reportedBlogRepository;

    @PostMapping("/saveBlog")
    public ResponseEntity<?> saveBlog(@RequestBody BlogDto user) {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        try {
            Blog blog = new Blog();
            blog.setTitle(user.getTitle());
            blog.setContent(user.getContent());
            blog.setAuthor(email);
            blog.setTimestamp(new Date());
            blogRepository.save(blog);

            return ResponseEntity.ok("Blog saved verified");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAll() {
        try {
            List<Blog> blogs = blogRepository.findAll();

            List<BlogResponseDto> response = blogs.stream()
                    .filter(BaseEntity::isActive)
                    .map(blog -> {
                        BlogResponseDto dto = new BlogResponseDto();
                        dto.setId(blog.getId());
                        dto.setAuthor(blog.getAuthor());
                        dto.setTitle(blog.getTitle());
                        dto.setContent(blog.getContent());
                        dto.setTimestamp(blog.getTimestamp().toString());
                        dto.setLikes(blog.getLikes());

                        List<CommentDto> comments = blog.getComments().stream().map(comment -> {
                            CommentDto c = new CommentDto();
                            c.setId(comment.getId());
                            c.setAuthor(comment.getAuthor());
                            c.setAvatar(comment.getAvatar());
                            c.setContent(comment.getContent());
                            return c;
                        }).collect(Collectors.toList());

                        dto.setComments(comments);
                        return dto;
                    }).collect(Collectors.toList());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }


    @PostMapping("/report/{reportingPostId}")
    public ResponseEntity<?> reportBlog(@PathVariable Integer reportingPostId, @RequestBody ReportRequestDto reportReason) {
        try {
            var blogOpt = blogRepository.findById(reportingPostId);
            if (blogOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Blog not found");
            }

            String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
            User reporter = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));

            var blog = blogOpt.get();

            User author = userRepository.findByEmail(blog.getAuthor()).orElseThrow(() -> new RuntimeException("User not found"));

            ReportedBlog report = new ReportedBlog();
            report.setBlogId(blog.getId());
            report.setBlogTitle(blog.getTitle());
            report.setAuthor(author);
            report.setReporter(reporter);
            report.setReason(reportReason.getReason());
            report.setStatus(ReportStatus.PENDING);

            reportedBlogRepository.save(report);

            return ResponseEntity.ok("Report submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}




