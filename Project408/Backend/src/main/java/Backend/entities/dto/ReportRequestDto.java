package Backend.entities.dto;

import lombok.Data;

@Data
public  class ReportRequestDto {
    private String reason;

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

}

