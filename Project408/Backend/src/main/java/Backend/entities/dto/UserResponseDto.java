package Backend.entities.dto;

import Backend.core.enums.UserType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class UserResponseDto {

    private String token;

    public UserResponseDto(String token , UserType userType ,Integer id) {
        this.token = token;
        this.userType = userType;
        this.id =id;
    }

    private UserType userType;
    private Integer id;

    public UserType getUserType() {
        return userType;
    }
    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
}