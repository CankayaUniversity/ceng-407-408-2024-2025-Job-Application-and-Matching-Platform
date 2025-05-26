package Backend.repository;

import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.ExamAndAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamAndAchievementRepository extends JpaRepository<ExamAndAchievement, Integer> {
}
