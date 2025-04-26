package Backend.entities.user.employer;

import Backend.entities.company.Company;
import Backend.entities.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity

@AllArgsConstructor
@NoArgsConstructor
@Table(name = "employers")
public class Employer extends User {


    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;


    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
