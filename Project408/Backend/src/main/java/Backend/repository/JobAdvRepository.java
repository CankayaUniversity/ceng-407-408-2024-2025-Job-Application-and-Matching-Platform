package Backend.repository;

import Backend.entities.jobAdv.JobAdv;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobAdvRepository extends JpaRepository<JobAdv, Integer> {

    @Query(value = "SELECT *\n" +
            "FROM job_advs j\n" +
            "JOIN companies c ON j.company_id = c.id\n" +
            "JOIN job_conditions jc ON j.job_condition_id  = jc.id  -- Assuming this join condition\n" +
            "join job_positions jp on j.id = jp.job_adv_id \n" +
            "WHERE\n" +
            "    (:jobPositionIds IS NULL OR jp.job_position_id  IN :jobPositionIds)\n" +
            "    AND (:workTypes IS NULL OR jc.work_type IN :workTypes)  -- Now filtering work_type from job_conditions\n" +
            "    AND (:minSalary IS NULL OR j.min_salary >= :minSalary)\n" +
            "    AND (:maxSalary IS NULL OR j.max_salary <= :maxSalary)\n" +
            "    AND (:cities IS NULL OR c.city IN :cities)\n" +
            "    AND (:countries IS NULL OR c.country IN :countries)\n" +
            "    AND (:companyIds IS NULL OR j.company_id IN :companyIds)", nativeQuery = true)
    List<JobAdv> filter(@Param("jobPositionIds") List<Integer> jobPositionIds,
                        @Param("workTypes") List<String> workTypes,
                        @Param("minSalary") Double minSalary,
                        @Param("maxSalary") Double maxSalary,
                        @Param("cities") List<String> cities,
                        @Param("countries") List<String> countries,
                        @Param("companyIds") List<Integer> companyIds);

}
