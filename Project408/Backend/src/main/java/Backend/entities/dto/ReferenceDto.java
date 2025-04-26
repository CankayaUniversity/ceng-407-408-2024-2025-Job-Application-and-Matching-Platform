package Backend.entities.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter

public class ReferenceDto {

    public String referenceName;

    public String referenceJobTitle;

    public String referenceCompany;

    public String referenceContactInfo;

    public String referenceYearsWorked;
}
