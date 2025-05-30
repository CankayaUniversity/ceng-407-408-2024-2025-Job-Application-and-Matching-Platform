package Backend.entities.common;

import Backend.entities.BaseEntity;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reported_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportedJob extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id")
    private JobAdv jobAdv;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reporter_id")
    private User reporter;
    
    @Column(name = "reason", nullable = false, length = 500)
    private String reason;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    public JobAdv getJobAdv() {
        return jobAdv;
    }

    public void setJobAdv(JobAdv jobAdv) {
        this.jobAdv = jobAdv;
    }

    public User getReporter() {
        return reporter;
    }

    public void setReporter(User reporter) {
        this.reporter = reporter;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }
}