package Backend.services;

import Backend.core.enums.UserType;
import Backend.entities.dto.UserDto;
import Backend.entities.dto.UserRegisterDto;
import Backend.entities.dto.UserResponseDto;
import Backend.entities.dto.VerifiedUserDto;
import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.repository.CandidateRepository;
import Backend.repository.EmployerRepository;
import Backend.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service

public class AuthenticationService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtService jwtService;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    CandidateRepository candidateRepository;
    @Autowired
    EmployerRepository employerRepository;

    @Autowired
    EmailService emailService;

    public Candidate canSave(UserRegisterDto userRegisterDto) {
        // Doğrudan Candidate nesnesi oluştur
        Candidate candidate = new Candidate();
        candidate.setEmail(userRegisterDto.getEmail());
        candidate.setFirstName(userRegisterDto.getFirstName());
        candidate.setLastName(userRegisterDto.getLastName());
        candidate.setPassword(passwordEncoder.encode(userRegisterDto.getPassword()));
        candidate.setUserType(UserType.CANDIDATE); // Kullanıcı tipini belirle

        candidate.setVerificationCode(generateVerificationCode());
        candidate.setVerificationCodeExpireAt(LocalDateTime.now().plusMinutes(10));
        candidate.setEnabled(false);
        sendVerificationEmail(candidate);

        // Candidate olarak kaydet
        return candidateRepository.save(candidate);
        // JWT token oluştur
    }

    public Employer empSave(UserRegisterDto userRegisterDto) {
        // Doğrudan Employer nesnesi oluştur
        Employer employer = new Employer();
        employer.setEmail(userRegisterDto.getEmail());
        employer.setFirstName(userRegisterDto.getFirstName());
        employer.setLastName(userRegisterDto.getLastName());
        employer.setPassword(passwordEncoder.encode(userRegisterDto.getPassword()));
        employer.setUserType(UserType.EMPLOYER); // Kullanıcı tipini belirle
        employer.setCompany(userRegisterDto.getCompany());

        employer.setVerificationCode(generateVerificationCode());
        employer.setVerificationCodeExpireAt(LocalDateTime.now().plusMinutes(10));
        employer.setEnabled(false);
        sendVerificationEmail(employer);

        // Candidate olarak kaydet
        return employerRepository.save(employer);

    }

    public UserResponseDto auth(UserDto userDto) {
        User user = userRepository.findByEmail(userDto.getEmail()).orElseThrow();
        if(!user.isEnabled()){
            throw new AuthenticationServiceException("Account is not verified.Please verify your account");
        }
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword()));
        String jwtToken = jwtService.generateToken(user);
        return new UserResponseDto(jwtToken,user.getUserType(),user.getId()); // Directly create an instance of UserResponseDto using the constructor
    }

    public void verifyUser(VerifiedUserDto intput) {
        Optional<User> optional=userRepository.findByEmail(intput.getEmail());
        if(optional.isPresent()){
            User user = optional.get();
            if(user.getVerificationCodeExpireAt().isBefore(LocalDateTime.now())){
                throw new AuthenticationServiceException("Verification code expired");
            }
            if(user.getVerificationCode().equals(intput.getVerificationCode())){
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpireAt(null);
                userRepository.save(user);
            }
            else{
                throw new AuthenticationServiceException("Invalid verification code");
            }
        }
        else{
            throw new AuthenticationServiceException("User does not exist");
        }
    }
    public void resendVerificationCode(String email) {
        Optional<User> optional=userRepository.findByEmail(email);
        if(optional.isPresent()){
            User user = optional.get();
            if(user.isEnabled()){
                throw new AuthenticationServiceException("Account is already verified");
            }
            user.setVerificationCode(generateVerificationCode());
            user.setVerificationCodeExpireAt(LocalDateTime.now().plusMinutes(10));
            sendVerificationEmail(user);
            userRepository.save(user);
        }
        else{
            throw new AuthenticationServiceException("User does not exist");
        }
    }

    public void sendVerificationEmail(User user) {
        String subject = "Account Verification";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getUsername(), subject, htmlMessage);
        } catch (MessagingException e) {
            // Handle email sending exception
            e.printStackTrace();
        }
    }

    private String generateVerificationCode(){
        Random random =new Random();
        int code=random.nextInt(999999);
        return String.valueOf(code);
    }

    public void sendResetPasswordCode(String email) throws MessagingException {
        Optional<User> optional = userRepository.findByEmail(email);
        if (optional.isEmpty())
            throw new RuntimeException("User not found");

        if(!optional.get().isEnabled()){
            throw new AuthenticationServiceException("Account is not verified. Please verify your account");
        }

        User user = optional.get();
        String resetCode = generateVerificationCode();
        user.setVerificationCode(resetCode);
        user.setVerificationCodeExpireAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        String subject = "Password Reset Code";
        String html = "<p>Your password reset code is: <strong>" + resetCode + "</strong></p>";
        emailService.sendVerificationEmail(user.getUsername(), subject, html);
    }

    public void resetPassword(String email, String code, String newPassword) {
        Optional<User> optional = userRepository.findByEmail(email);
        if (optional.isEmpty())
            throw new RuntimeException("User not found");

        User user = optional.get();

        if (!user.getVerificationCode().equals(code))
            throw new RuntimeException("Invalid code");

        if (user.getVerificationCodeExpireAt().isBefore(LocalDateTime.now()))
            throw new RuntimeException("Code expired");

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerificationCode(null);
        user.setVerificationCodeExpireAt(null);
        userRepository.save(user);
    }


}
