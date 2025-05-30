package Backend.entities.user;

import Backend.core.enums.UserType;
import Backend.entities.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity

@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Inheritance(strategy = InheritanceType.JOINED)
public class User extends BaseEntity implements UserDetails {

    private String firstName;

    private String lastName;

    private String email;

    @JsonIgnore // Don't serialize the password
    private String password;

    private boolean enabled;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;

    @Column(name="verification_code")
    private String verificationCode;

    @Column(name="verification_expiration")
    private LocalDateTime verificationCodeExpireAt;



    //return user roles
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        //return all roles
        return List.of(new SimpleGrantedAuthority(userType.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }
    @Override
    public String getPassword() {
        return password;
    }


    //hesabın süresinin dolup dolmadığı kontrol eder
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    // hesap kitli mi degil m,
    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    //kullanici aktif mi değil mi


    public void setUserType(UserType role) {
        this.userType = role;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setFirstName(String name) {
        this.firstName = name;
    }
    public void setLastName(String surname) {
        this.lastName = surname;
    }

    public UserType getUserType() {
        return userType;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }


    public LocalDateTime getVerificationCodeExpireAt() {
        return verificationCodeExpireAt;
    }

    public void setVerificationCodeExpireAt(LocalDateTime verificationCodeExpireAt) {
        this.verificationCodeExpireAt = verificationCodeExpireAt;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getEmail() {
        return email;
    }

}

