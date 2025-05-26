package Backend.entities.user.candidate;

import Backend.core.enums.*;
import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
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

    private LocalDate militaryDefermentDate;

    @Enumerated(EnumType.STRING)
    private DisabilityStatus disabilityStatus;

    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;

    private boolean currentEmploymentStatus;

    private boolean drivingLicense;

    private boolean isPrivateProfile;

    private String profilePicture;

    private LocalDate birthDate;


    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public Nationality getNationality() {
        return nationality;
    }

    public void setNationality(Nationality nationality) {
        this.nationality = nationality;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public MilitaryStatus getMilitaryStatus() {
        return militaryStatus;
    }

    public void setMilitaryStatus(MilitaryStatus militaryStatus) {
        this.militaryStatus = militaryStatus;
    }

    public LocalDate getMilitaryDefermentDate() {
        return militaryDefermentDate;
    }

    public void setMilitaryDefermentDate(LocalDate militaryDefermentDate) {
        this.militaryDefermentDate = militaryDefermentDate;
    }

    public DisabilityStatus getDisabilityStatus() {
        return disabilityStatus;
    }

    public void setDisabilityStatus(DisabilityStatus disabilityStatus) {
        this.disabilityStatus = disabilityStatus;
    }

    public MaritalStatus getMaritalStatus() {
        return maritalStatus;
    }

    public void setMaritalStatus(MaritalStatus maritalStatus) {
        this.maritalStatus = maritalStatus;
    }

    public boolean isCurrentEmploymentStatus() {
        return currentEmploymentStatus;
    }

    public void setCurrentEmploymentStatus(boolean currentEmploymentStatus) {
        this.currentEmploymentStatus = currentEmploymentStatus;
    }

    public boolean isDrivingLicense() {
        return drivingLicense;
    }

    public void setDrivingLicense(boolean drivingLicense) {
        this.drivingLicense = drivingLicense;
    }

    public boolean isPrivateProfile() {
        return isPrivateProfile;
    }

    public void setPrivateProfile(boolean privateProfile) {
        isPrivateProfile = privateProfile;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
}
