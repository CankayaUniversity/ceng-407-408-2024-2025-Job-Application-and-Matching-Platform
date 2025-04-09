package Backend.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data

@NoArgsConstructor
@AllArgsConstructor
public class FilterDto {

    private List<Integer> jobPositionIds;
    private List<String> workTypes;
    private Double minSalary;
    private Double maxSalary;
    private List<String> cities;
    private List<String> countries;
    private List<Integer> companyIds;

    public List<Integer> getJobPositionIds() {
        return jobPositionIds;
    }
    public void setJobPositionIds(List<Integer> jobPositionIds) {
        this.jobPositionIds = jobPositionIds;
    }
    public List<String> getWorkTypes() {
        return workTypes;
    }
    public void setWorkTypes(List<String> workTypes) {
        this.workTypes = workTypes;

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
    public List<String> getCities() {
        return cities;
    }
    public void setCities(List<String> cities) {
        this.cities = cities;
    }
    public List<String> getCountries() {
        return countries;
    }
    public void setCountries(List<String> countries) {
        this.countries = countries;
    }
    public List<Integer> getCompanyIds() {
        return companyIds;
    }
    public void setCompanyIds(List<Integer> companyIds) {
        this.companyIds = companyIds;
    }

}

