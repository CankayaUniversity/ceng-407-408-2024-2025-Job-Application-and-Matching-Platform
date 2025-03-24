package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import Backend.core.location.City;
import Backend.core.location.Country;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contact_information")
public class ContactInformation extends BaseEntity {

    @Column(name = "phone_number")
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;
}
