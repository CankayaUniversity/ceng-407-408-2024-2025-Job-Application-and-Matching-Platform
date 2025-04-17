package Backend.repository;


import Backend.core.enums.JobPosition;
import Backend.entities.common.JobPositions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JobPositionsRepository extends JpaRepository<JobPositions, Integer> {
    Optional<JobPositions> findByPositionType(JobPosition positionType);
} 