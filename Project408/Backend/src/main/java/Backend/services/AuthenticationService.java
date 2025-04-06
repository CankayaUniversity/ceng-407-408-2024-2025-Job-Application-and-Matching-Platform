package Backend.services;

import Backend.core.enums.UserType;
import Backend.entities.dto.UserDto;
import Backend.entities.dto.UserRegisterDto;
import Backend.entities.dto.UserResponseDto;
import Backend.entities.user.User;
import Backend.entities.user.candidate.Candidate;
import Backend.entities.user.employer.Employer;
import Backend.repository.CandidateRepository;
import Backend.repository.EmployerRepository;
import Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public UserResponseDto canSave(UserRegisterDto userRegisterDto) {
        // Doğrudan Candidate nesnesi oluştur
        Candidate candidate = new Candidate();
        candidate.setEmail(userRegisterDto.getEmail());
        candidate.setFirstName(userRegisterDto.getFirstName());
        candidate.setLastName(userRegisterDto.getLastName());
        candidate.setPassword(passwordEncoder.encode(userRegisterDto.getPassword()));
        candidate.setUserType(UserType.CANDIDATE); // Kullanıcı tipini belirle

        // Candidate olarak kaydet
        candidateRepository.save(candidate);

        // JWT token oluştur
        String jwtToken = jwtService.generateToken(candidate);

        return new UserResponseDto(jwtToken);
    }
    public UserResponseDto empSave(UserRegisterDto userRegisterDto) {
        // Doğrudan Employer nesnesi oluştur
        Employer employer = new Employer();
        employer.setEmail(userRegisterDto.getEmail());
        employer.setFirstName(userRegisterDto.getFirstName());
        employer.setLastName(userRegisterDto.getLastName());
        employer.setPassword(passwordEncoder.encode(userRegisterDto.getPassword()));
        employer.setUserType(UserType.EMPLOYER); // Kullanıcı tipini belirle
        employer.setCompany(userRegisterDto.getCompany());
        // Candidate olarak kaydet
        employerRepository.save(employer);

        // JWT token oluştur
        String jwtToken = jwtService.generateToken(employer);

        return new UserResponseDto(jwtToken);
    }

    public UserResponseDto auth(UserDto userDto) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword()));
        User user = userRepository.findByEmail(userDto.getEmail()).orElseThrow();
        String jwtToken = jwtService.generateToken(user);
        return new UserResponseDto(jwtToken); // Directly create an instance of UserResponseDto using the constructor
    }

}
