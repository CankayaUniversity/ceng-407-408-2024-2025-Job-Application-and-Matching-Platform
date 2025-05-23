package Backend.services;

import Backend.entities.dto.ReportedBlogDTO;
import Backend.entities.dto.ReportedJobDTO;
import Backend.entities.dto.ReportedUserDTO;

import java.util.List;

public interface AdminService {
    String getAdminName(Integer id);
    List<ReportedUserDTO> getReportedUsers();
    void banUser(Integer id);
    List<ReportedJobDTO> getReportedJobs();
    void removeJob(Integer id);
    List<ReportedBlogDTO> getReportedBlogs();
    void removeBlog(Integer id);
} 