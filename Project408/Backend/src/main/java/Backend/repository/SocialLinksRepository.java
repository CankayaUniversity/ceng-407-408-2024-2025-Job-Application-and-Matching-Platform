package Backend.repository;

import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.candidate.SocialLinks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SocialLinksRepository extends JpaRepository<SocialLinks, Integer> {
}
