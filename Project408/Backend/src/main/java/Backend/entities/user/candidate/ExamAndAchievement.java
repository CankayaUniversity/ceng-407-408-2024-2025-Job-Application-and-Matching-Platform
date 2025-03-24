package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "exam_and_achievements")
public class ExamAndAchievement extends BaseEntity {

    @Column(name = "exam_name", nullable = false)
    private String examName;

    @Column(name = "exam_year")
    private int examYear;

    @Column(name = "exam_score")
    private double examScore;

    @Column(name = "exam_rank")
    private String examRank;
}
