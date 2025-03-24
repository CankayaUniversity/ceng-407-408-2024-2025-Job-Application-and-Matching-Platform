package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hobbies")
public class Hobby extends BaseEntity {

    @Column(name = "hobby_name", nullable = false)
    private String hobbyName;

    @Column(length = 1000)
    private String description;
}
