package Backend.entities.user.candidate;

import Backend.core.enums.ApplicationStatus;
import Backend.entities.BaseEntity;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.offer.JobOffer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_applications")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JobApplication extends BaseEntity {

    @ManyToOne( fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    @JsonManagedReference // Marks this side of the relationship as the one to be serialized
    private Candidate candidate;  // Aday

    @ManyToOne
    @JoinColumn(name = "job_adv_id")
    private JobAdv jobAdv;  // İş ilanı

    @Column(name = "application_date")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate applicationDate;  // Başvuru tarihi

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;  // Başvuru durumu (bekliyor, kabul edildi, reddedildi vs.)

    // Aday, referanslarının işverene görünmesini onayladı mı?
    @Column(name = "reference_permission")
    private boolean referencePermission;

    // Aday, iletişim bilgilerinin işverene görünmesini onayladı mı?
    @Column(name = "contact_permission")
    private boolean contactPermission;
    
    // İş teklifleri
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private List<JobOffer> offers = new ArrayList<>();

    // Cover letter field
    @Column(name = "cover_letter", length = 2000)
    private String coverLetter;

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

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
    
    public boolean isReferencePermission() {
        return referencePermission;
    }

    public void setReferencePermission(boolean referencePermission) {
        this.referencePermission = referencePermission;
    }

    public boolean isContactPermission() {
        return contactPermission;
    }

    public void setContactPermission(boolean contactPermission) {
        this.contactPermission = contactPermission;
    }

    public List<JobOffer> getOffers() {
        return offers;
    }

    public void setOffers(List<JobOffer> offers) {
        this.offers = offers;
    }
    
    public String getCoverLetter() {
        return coverLetter;
    }
    
    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
}
