package Backend.request.jobAdv;

import Backend.core.enums.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobAdvCreateRequest {

    private int employerId; // Şimdilik ThunderClient'ten manuel verilecek

    private String description;
    private Double minSalary;
    private Double maxSalary;
    private LocalDate deadline;
    private boolean travelRest;
    private boolean license;

    // JobCondition
    private WorkType workType;
    private EmploymentType employmentType;
    private int countryId;
    private int minWorkHours;
    private int maxWorkHours;

    // JobQualification
    private DegreeType degreeType;
    private JobExperience jobExperience;
    private int experienceYears;
    private MilitaryStatus militaryStatus;

    private List<String> technicalSkills;  // skillName listesi
    private List<String> socialSkills;     // skillName listesi

    private List<Integer> languageProficiencyIds;  // Daha önce eklenmiş ID’ler

    private List<Integer> benefitTypeIds;  // Enum’lardan alınabilir ya da string list de olabilir
    private List<Integer> jobPositionIds;
}
