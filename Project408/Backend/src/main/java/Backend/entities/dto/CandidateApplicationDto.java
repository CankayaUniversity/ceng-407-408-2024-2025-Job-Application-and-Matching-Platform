package Backend.entities.dto;

import Backend.entities.user.candidate.Candidate;
import lombok.Data;

@Data
public class CandidateApplicationDto {
    private int applicationId;
    private Candidate candidate;

    public CandidateApplicationDto(int applicationId, Candidate candidate) {
        this.applicationId = applicationId;
        this.candidate = candidate;
    }

    public int getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(int applicationId) {
        this.applicationId = applicationId;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }
}
