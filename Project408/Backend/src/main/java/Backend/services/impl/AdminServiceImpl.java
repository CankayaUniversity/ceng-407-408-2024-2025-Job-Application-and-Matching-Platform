package Backend.services.impl;

import Backend.entities.common.ReportedBlog;
import Backend.entities.common.ReportedJob;
import Backend.entities.common.ReportedUser;
import Backend.entities.common.ReportStatus;
import Backend.entities.dto.ReportedBlogDTO;
import Backend.entities.dto.ReportedJobDTO;
import Backend.entities.dto.ReportedUserDTO;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.User;
import Backend.repository.JobAdvRepository;
import Backend.repository.ReportedBlogRepository;
import Backend.repository.ReportedJobRepository;
import Backend.repository.ReportedUserRepository;
import Backend.repository.UserRepository;
import Backend.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

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
        jobAdvRepository.delete(jobAdv);
        
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
        
        // Here we would delete the blog from a blog repository
        // But since we don't have the blog entity yet, we'll just update the status
        
        reportedBlog.setStatus(ReportStatus.RESOLVED);
        reportedBlogRepository.save(reportedBlog);
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