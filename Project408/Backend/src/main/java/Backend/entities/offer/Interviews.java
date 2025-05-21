package Backend.entities.offer;

import Backend.core.enums.InterviewType;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.entities.user.candidate.JobApplication;
import Backend.entities.offer.JobOffer;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")

public class Interviews extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;

    @ManyToOne
    @JoinColumn(name = "job_application_id")
    private JobApplication jobApplication;

    @ManyToOne
    @JoinColumn(name = "job_offer_id")
    private JobOffer jobOffer;

    @Column(name = "interview_datetime", nullable = false)
    private LocalDateTime interviewDateTime;

    @Enumerated(EnumType.STRING)
    private InterviewType interviewType;

    @Column(name = "notes", length = 1000)
    private String notes;



    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public Employer getEmployer() {
        return employer;
    }

    public void setEmployer(Employer employer) {
        this.employer = employer;
    }

    public JobApplication getJobApplication() {
        return jobApplication;
    }

    public void setJobApplication(JobApplication jobApplication) {
        this.jobApplication = jobApplication;
    }

    public JobOffer getJobOffer() {
        return jobOffer;
    }

    public void setJobOffer(JobOffer jobOffer) {
        this.jobOffer = jobOffer;
    }

    public LocalDateTime getInterviewDateTime() {
        return interviewDateTime;
    }

    public void setInterviewDateTime(LocalDateTime interviewDateTime) {
        this.interviewDateTime = interviewDateTime;
    }


    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public InterviewType getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(InterviewType interviewType) {
        this.interviewType = interviewType;
    }
}
