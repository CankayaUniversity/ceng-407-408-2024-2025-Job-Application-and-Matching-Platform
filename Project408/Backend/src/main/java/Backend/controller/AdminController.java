package Backend.controller;

import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.User;
import Backend.services.AdminService;
import Backend.entities.dto.ReportedBlogDTO;
import Backend.entities.dto.ReportedJobDTO;
import Backend.entities.dto.ReportedUserDTO;
import Backend.entities.dto.ReportMetricsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
//@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/userName/{id}")
    public ResponseEntity<Map<String, String>> getUserName(@PathVariable Integer id) {
        String userName = adminService.getAdminName(id);
        return ResponseEntity.ok(Map.of("userName", userName));
    }

    @GetMapping("/reportedUsers")
    public ResponseEntity<List<ReportedUserDTO>> getReportedUsers() {
        List<ReportedUserDTO> reportedUsers = adminService.getReportedUsers();
        return ResponseEntity.ok(reportedUsers);
    }

    @PostMapping("/banUser/{id}")
    public ResponseEntity<?> banUser(@PathVariable Integer id) {
        adminService.banUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reportedJobs")
    public ResponseEntity<List<ReportedJobDTO>> getReportedJobs() {
        List<ReportedJobDTO> reportedJobs = adminService.getReportedJobs();
        return ResponseEntity.ok(reportedJobs);
    }

    @PostMapping("/removeJob/{id}")
    public ResponseEntity<?> removeJob(@PathVariable Integer id) {
        adminService.removeJob(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reportedBlogs")
    public ResponseEntity<List<ReportedBlogDTO>> getReportedBlogs() {
        List<ReportedBlogDTO> reportedBlogs = adminService.getReportedBlogs();
        return ResponseEntity.ok(reportedBlogs);
    }

    @GetMapping("/report-metrics")
    public ResponseEntity<ReportMetricsDTO> getReportMetrics() {
        ReportMetricsDTO metrics = adminService.getReportMetrics();
        return ResponseEntity.ok(metrics);
    }

    @PostMapping("/removeBlog/{id}")
    public ResponseEntity<?> removeBlog(@PathVariable Integer id) {
        adminService.removeBlog(id);
        return ResponseEntity.ok().build();
    }
} 