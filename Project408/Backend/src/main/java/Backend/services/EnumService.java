package Backend.services;

import Backend.core.enums.*;
import org.springframework.stereotype.Service;


@Service
public class EnumService {

    public ApplicationStatus getApplicationStatus() {
        return ApplicationStatus.values()[ApplicationStatus.values().length - 1];
    }

    public BenefitType getBenefitType() {
        return BenefitType.values()[BenefitType.values().length - 1];
    }

    public DegreeType getDegreeType() {
        return DegreeType.values()[DegreeType.values().length - 1];
    }

    public DisabilityStatus getDisabilityStatus() {
        return DisabilityStatus.values()[DisabilityStatus.values().length - 1];
    }

    public DocumentCategory getDocumentCategory() {
        return DocumentCategory.values()[DocumentCategory.values().length - 1];
    }

    public EmploymentType getEmploymentType() {
        return EmploymentType.values()[EmploymentType.values().length - 1];
    }

    public Gender getGender() {
        return Gender.values()[Gender.values().length - 1];
    }

    public JobAdvStatus getJobAdvStatus() {
        return JobAdvStatus.values()[JobAdvStatus.values().length - 1];
    }

    public JobExperience getJobExperience() {
        return JobExperience.values()[JobExperience.values().length - 1];
    }

    public JobPosition getJobPosition() {
        return JobPosition.values()[JobPosition.values().length - 1];
    }

    public LanguageLevel getLanguageLevel() {
        return LanguageLevel.values()[LanguageLevel.values().length - 1];
    }

    public MaritalStatus getMaritalStatus() {
        return MaritalStatus.values()[MaritalStatus.values().length - 1];
    }

    public MilitaryStatus getMilitaryStatus() {
        return MilitaryStatus.values()[MilitaryStatus.values().length - 1];
    }

    public Nationality getNationality() {
        return Nationality.values()[Nationality.values().length - 1];
    }

    public OfferStatus getOfferStatus() {
        return OfferStatus.values()[OfferStatus.values().length - 1];
    }

    public ProjectStatus getProjectStatus() {
        return ProjectStatus.values()[ProjectStatus.values().length - 1];
    }

    public SkillLevel getSkillLevel() {
        return SkillLevel.values()[SkillLevel.values().length - 1];
    }

    public UserType getUserType() {
        return UserType.values()[UserType.values().length - 1];
    }

    public WorkType getWorkType() {
        return WorkType.values()[WorkType.values().length - 1];
    }
}
