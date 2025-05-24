package Backend.entities.dto;

import lombok.*;

import java.util.Map;

@Setter
@Getter
@Data
@NoArgsConstructor
public class ReportMetricsDTO {
    private Map<String, Long> userReportCountsByStatus;
    private Map<String, Long> jobReportCountsByStatus;
    private Map<String, Long> blogReportCountsByStatus;
    private long totalPendingReports;
    private long totalResolvedReports;
    private long totalReports;

    public ReportMetricsDTO(Map<String, Long>  userReportCountsByStatus, Map<String, Long>  jobReportCountsByStatus, Map<String, Long> blogReportCountsByStatus, long totalPendingReports, long totalResolvedReports,long totalReports) {
        this.userReportCountsByStatus = userReportCountsByStatus;
        this.jobReportCountsByStatus = jobReportCountsByStatus;
        this.blogReportCountsByStatus = blogReportCountsByStatus;
        this.totalPendingReports = totalPendingReports;
        this.totalResolvedReports = totalResolvedReports;
        this.totalReports = totalReports;
    }

}
