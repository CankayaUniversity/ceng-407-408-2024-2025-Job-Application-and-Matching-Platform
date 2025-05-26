package Backend.entities.common;

import Backend.core.enums.JobPosition;
import Backend.entities.BaseEntity;
import Backend.entities.jobAdv.JobAdv;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity

@AllArgsConstructor
@Table(name = "job_positions")
public class JobPositions extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "position_type", nullable = false)
    private JobPosition positionType;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "custom_job_position_id")
    private CustomJobPosition customJobPosition;

    @ManyToOne
    @JoinColumn(name = "job_adv_id") // Veritabanındaki yabancı anahtar
    @JsonBackReference ("jobadv_3")// Prevents circular references during serialization
    private JobAdv jobAdv;


    public JobPositions(int i, JobPosition jobPosition, Object o, Object o1) {
        super();
    }
    public JobPositions() {

    }


    public JobPosition getPositionType() {
        return positionType;
    }

    public void setPositionType(JobPosition positionType) {
        this.positionType = positionType;
    }

    public CustomJobPosition getCustomJobPosition() {
        return customJobPosition;
    }

    public void setCustomJobPosition(CustomJobPosition customJobPosition) {
        this.customJobPosition = customJobPosition;
    }

    public JobAdv getJobAdv() {
        return jobAdv;
    }

    public void setJobAdv(JobAdv jobAdv) {
        this.jobAdv = jobAdv;
    }
}
