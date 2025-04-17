package Backend.core.location;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "cities")
public class City extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @OneToMany(mappedBy = "city", cascade = CascadeType.PERSIST) // CascadeType.ALL yerine sadece PERSIST kullanılabilir.
    private List<University> universities;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public List<University> getUniversities() {
        return universities;
    }

    public void setUniversities(List<University> universities) {
        this.universities = universities;
    }
}
