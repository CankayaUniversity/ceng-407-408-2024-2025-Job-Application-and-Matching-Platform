package Backend.entities.user.employer;

import Backend.entities.company.Company;
import Backend.entities.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity

@AllArgsConstructor
@NoArgsConstructor
@Table(name = "employers")
public class Employer extends User {


    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "company_id")
    @JsonBackReference("employers")
    private Company company;


    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
