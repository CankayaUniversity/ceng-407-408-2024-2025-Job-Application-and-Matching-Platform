package Backend.request.jobAdv;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;


public class JobAdvUpdateRequest {

    private String description;
    private Double minSalary;
    private Double maxSalary;
    private LocalDate deadline;
    private boolean travelRest;
    private boolean license;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMinSalary() {
        return minSalary;
    }

    public void setMinSalary(Double minSalary) {
        this.minSalary = minSalary;
    }

    public Double getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(Double maxSalary) {
        this.maxSalary = maxSalary;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public boolean isTravelRest() {
        return travelRest;
    }

    public void setTravelRest(boolean travelRest) {
        this.travelRest = travelRest;
    }

    public boolean isLicense() {
        return license;
    }

    public void setLicense(boolean license) {
        this.license = license;
    }
}
