package Backend.entities.user.candidate;

import Backend.core.enums.*;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "profile_details")
public class ProfileDetails extends BaseEntity {

    @Column(length = 1000)
    private String aboutMe;

    @Enumerated(EnumType.STRING)
    private Nationality nationality;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private MilitaryStatus militaryStatus;

    private String militaryDefermentDate;

    @Enumerated(EnumType.STRING)
    private DisabilityStatus disabilityStatus;

    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    private boolean currentEmploymentStatus;

    private boolean drivingLicense;

    private boolean isPrivateProfile;

    private String profilePicture;

    private LocalDate birthDate;
}
