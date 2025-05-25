package Backend.services.impl;

import Backend.entities.common.*;
import Backend.entities.dto.ReportMetricsDTO;

import Backend.entities.dto.ReportedBlogDTO;
import Backend.entities.dto.ReportedJobDTO;
import Backend.entities.dto.ReportedUserDTO;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.User;
import Backend.repository.*;
import Backend.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReportedUserRepository reportedUserRepository;

    @Autowired
    private ReportedJobRepository reportedJobRepository;

    @Autowired
    private ReportedBlogRepository reportedBlogRepository;

    @Autowired
    private JobAdvRepository jobAdvRepository;
    @Autowired
    private BlogRepository blogRepository;

    @Override
    public String getAdminName(Integer id) {
        User admin = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Admin not found with id: " + id));
        return admin.getFirstName() + " " + admin.getLastName();
    }

    @Override
    public List<ReportedUserDTO> getReportedUsers() {
        List<ReportedUser> reportedUsers = reportedUserRepository.findAll();
        
        return reportedUsers.stream()
                .map(this::convertToReportedUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void banUser(Integer id) {
        ReportedUser reportedUser = reportedUserRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reported user not found with id: " + id));
        
        User user = reportedUser.getReportedUser();
        user.setActive(false);
        user.setEnabled(false);
        userRepository.save(user);
        
        reportedUser.setStatus(ReportStatus.RESOLVED);
        reportedUserRepository.save(reportedUser);
    }

    @Override
    public List<ReportedJobDTO> getReportedJobs() {
        List<ReportedJob> reportedJobs = reportedJobRepository.findAll();
        
        return reportedJobs.stream()
                .map(this::convertToReportedJobDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeJob(Integer id) {
        ReportedJob reportedJob = reportedJobRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reported job not found with id: " + id));
        
        JobAdv jobAdv = reportedJob.getJobAdv();
        jobAdv.setActive(false);
        jobAdvRepository.save(jobAdv);

//        jobAdvRepository.delete(jobAdv);
        
        reportedJob.setStatus(ReportStatus.RESOLVED);
        reportedJobRepository.save(reportedJob);
    }

    @Override
    public List<ReportedBlogDTO> getReportedBlogs() {
        List<ReportedBlog> reportedBlogs = reportedBlogRepository.findAll();
        
        return reportedBlogs.stream()
                .map(this::convertToReportedBlogDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeBlog(Integer id) {
        ReportedBlog reportedBlog = reportedBlogRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Reported blog not found with id: " + id));
        
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new NoSuchElementException("Blog not found with id: " + id));
        blog.setActive(false);
        blogRepository.save(blog);

        reportedBlog.setStatus(ReportStatus.RESOLVED);
        reportedBlogRepository.save(reportedBlog);
    }

    @Override
    public ReportMetricsDTO getReportMetrics() {
        Map<String, Long> userReportCounts = convertCountsToMap(reportedUserRepository.countByStatus());
        Map<String, Long> jobReportCounts = convertCountsToMap(reportedJobRepository.countByStatus());
        Map<String, Long> blogReportCounts = convertCountsToMap(reportedBlogRepository.countByStatus());

        long totalPending = userReportCounts.getOrDefault(ReportStatus.PENDING.name(), 0L) +
                            jobReportCounts.getOrDefault(ReportStatus.PENDING.name(), 0L) +
                            blogReportCounts.getOrDefault(ReportStatus.PENDING.name(), 0L);

        long totalResolved = userReportCounts.getOrDefault(ReportStatus.RESOLVED.name(), 0L) +
                             jobReportCounts.getOrDefault(ReportStatus.RESOLVED.name(), 0L) +
                             blogReportCounts.getOrDefault(ReportStatus.RESOLVED.name(), 0L);
        
        long totalReports = reportedUserRepository.count() + reportedJobRepository.count() + reportedBlogRepository.count();

        return new ReportMetricsDTO(userReportCounts, jobReportCounts, blogReportCounts, totalPending, totalResolved, totalReports);
    }

    private Map<String, Long> convertCountsToMap(List<Object[]> counts) {
        Map<String, Long> map = new HashMap<>();
        for (Object[] count : counts) {
            if (count[0] instanceof ReportStatus && count[1] instanceof Long) {
                 map.put(((ReportStatus) count[0]).name(), (Long) count[1]);
            }
        }
        // Ensure all statuses are present in the map, even if count is 0
        for (ReportStatus status : ReportStatus.values()) {
            map.putIfAbsent(status.name(), 0L);
        }
        return map;
    }
    
    private ReportedUserDTO convertToReportedUserDTO(ReportedUser reportedUser) {
        User user = reportedUser.getReportedUser();
        return new ReportedUserDTO(
                reportedUser.getId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                reportedUser.getReason(),
                reportedUser.getStatus().name()
        );
    }
    
    private ReportedJobDTO convertToReportedJobDTO(ReportedJob reportedJob) {
        JobAdv jobAdv = reportedJob.getJobAdv();
        User reporter = reportedJob.getReporter();
        String title = jobAdv.getJobPositions().stream()
                                .map(jp -> jp.getPositionType().name())
                                .collect(Collectors.joining(", "));
        String companyName = jobAdv.getCompany() != null ? jobAdv.getCompany().getCompanyName() : "N/A";

        return new ReportedJobDTO(
                reportedJob.getId(),
                title,
                companyName,
                reporter != null ? reporter.getEmail() : "N/A",
                reportedJob.getReason(),
                reportedJob.getStatus().name()
        );
    }
    
    private ReportedBlogDTO convertToReportedBlogDTO(ReportedBlog reportedBlog) {
        User author = reportedBlog.getAuthor();
        return new ReportedBlogDTO(
                reportedBlog.getId(),
                reportedBlog.getBlogTitle(),
                author != null ? author.getEmail() : "N/A",
                reportedBlog.getReason(),
                reportedBlog.getStatus().name()
        );
    }
} 