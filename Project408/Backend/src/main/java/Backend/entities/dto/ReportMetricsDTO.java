package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportMetricsDTO {
    private Map<String, Long> userReportCountsByStatus;
    private Map<String, Long> jobReportCountsByStatus;
    private Map<String, Long> blogReportCountsByStatus;
    private long totalPendingReports;
    private long totalResolvedReports;
    private long totalReports;
} 