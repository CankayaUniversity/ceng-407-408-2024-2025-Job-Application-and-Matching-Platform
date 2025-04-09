package Backend.entities.user.candidate;

import Backend.core.enums.JobAdvStatus;
import Backend.entities.BaseEntity;
import Backend.entities.jobAdv.JobAdv;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_application")
public class JobApplication extends BaseEntity {

    @ManyToOne(cascade = CascadeType.PERSIST)  // Kaydetme işlemi sırasında ilişkiyi yönet
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;  // Aday

    @ManyToOne(cascade = CascadeType.PERSIST)  // Kaydetme işlemi sırasında ilişkiyi yönet
    @JoinColumn(name = "jobAdv_id")
    private JobAdv jobAdv;  // İş ilanı

    @Column(name = "application_date")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate applicationDate;  // Başvuru tarihi

    @Enumerated(EnumType.STRING)
    private JobAdvStatus status;  // Başvuru durumu (bekliyor, kabul edildi, reddedildi vs.)

    // Getter ve setter metodları
    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public JobAdv getJobAdv() {
        return jobAdv;
    }

    public void setJobAdv(JobAdv jobAdv) {
        this.jobAdv = jobAdv;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public JobAdvStatus getStatus() {
        return status;
    }

    public void setStatus(JobAdvStatus status) {
        this.status = status;
    }
}
