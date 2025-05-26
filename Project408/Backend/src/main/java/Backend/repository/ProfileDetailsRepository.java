package Backend.repository;

import Backend.entities.user.candidate.ProfileDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileDetailsRepository extends JpaRepository<ProfileDetails, Integer> {
}
