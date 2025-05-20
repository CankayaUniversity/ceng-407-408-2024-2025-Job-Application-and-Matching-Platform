package Backend.repository;

import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Integer> {

    Optional<Candidate> findById(int id);
    Optional<Candidate> findByEmail(String email);

    @Query(value ="select\n" +
            "\tc.*,\n" +
            "\tpd.createdat ,\n" +
            "\tpd.is_active ,\n" +
            "\tpd.updatedat ,\n" +
            "\ts.firstname ,\n" +
            "\ts.lastname ,\n" +
            "\ts.email ,\n" +
            "\ts.user_type ,\n" +
            "\ts.\"password\" \n" +
            "from\n" +
            "\tcandidates c\n" +
            "inner join users s on\n" +
            "\tc.id = s.id\n" +
            "inner join profile_details pd on\n" +
            "\tc.profile_details_id = pd.id\n" +
            "inner join educations e on\n" +
            "\tc.education_id = e.id\n" +
            "inner join job_preferences jp on\n" +
            "\tc.jobpreferences_id = jp.id\n" +
            "inner join social_links sl on\n" +
            "\tc.social_links_id = sl.id\n" +
            "inner join work_experiences we on\n" +
            "\tc.id = we.candidate_id",nativeQuery = true)
    List<Candidate> getAvailableCandidates();
}
