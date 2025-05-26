package Backend.entities.user.candidate;

import Backend.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity

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

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public int getExamYear() {
        return examYear;
    }

    public void setExamYear(int examYear) {
        this.examYear = examYear;
    }

    public double getExamScore() {
        return examScore;
    }

    public void setExamScore(double examScore) {
        this.examScore = examScore;
    }

    public String getExamRank() {
        return examRank;
    }

    public void setExamRank(String examRank) {
        this.examRank = examRank;
    }
}
