package Backend.entities.user.candidate;

import Backend.core.enums.ApplicationStatus;
import Backend.entities.BaseEntity;
import Backend.entities.jobAdv.JobAdv;
import Backend.entities.offer.JobOffer;
import com.fasterxml.jackson.annotation.JsonFormat;
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
public class JobApplication extends BaseEntity {

    @ManyToOne(cascade = CascadeType.PERSIST)  // Kaydetme işlemi sırasında ilişkiyi yönet
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;  // Aday

    @ManyToOne(cascade = CascadeType.PERSIST)  // Kaydetme işlemi sırasında ilişkiyi yönet
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
}
