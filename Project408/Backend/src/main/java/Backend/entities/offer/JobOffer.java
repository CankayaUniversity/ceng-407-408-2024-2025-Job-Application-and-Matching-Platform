package Backend.entities.offer;

import Backend.entities.user.candidate.JobApplication;
import Backend.entities.user.employer.Employer;
import Backend.core.enums.OfferStatus;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_offers")
public class JobOffer extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "application_id")
    private JobApplication application;

    @ManyToOne
    @JoinColumn(name = "employer_id")
    private Employer employer;

    @Column(name = "salary_offer")
    private Double salaryOffer;

    @Column(name = "work_hours")
    private String workHours;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "location")
    private String location;

    @Column(name = "benefits", length = 500)
    private String benefits;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OfferStatus status = OfferStatus.PENDING;

    public Employer getEmployer() {
        return employer;
    }

    public void setEmployer(Employer employer) {
        this.employer = employer;
    }

    public Double getSalaryOffer() {
        return salaryOffer;
    }

    public void setSalaryOffer(Double salaryOffer) {
        this.salaryOffer = salaryOffer;
    }

    public String getWorkHours() {
        return workHours;
    }

    public void setWorkHours(String workHours) {
        this.workHours = workHours;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public OfferStatus getStatus() {
        return status;
    }

    public void setStatus(OfferStatus status) {
        this.status = status;
    }

    public JobApplication getApplication() {
        return application;
    }

    public void setApplication(JobApplication application) {
        this.application = application;
    }
}
