package Backend.repository;


import Backend.entities.offer.JobOffer;
import Backend.entities.user.employer.Employer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Integer> {

    List<JobOffer> findByEmployer(Employer emp);
}