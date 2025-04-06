package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hobbies")
public class Hobby extends BaseEntity {

    @Column(name = "hobby_name", nullable = false)
    private String hobbyName;

    @Column(length = 1000)
    private String description;

    public String getHobbyName() {
        return hobbyName;
    }

    public void setHobbyName(String hobbyName) {
        this.hobbyName = hobbyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
