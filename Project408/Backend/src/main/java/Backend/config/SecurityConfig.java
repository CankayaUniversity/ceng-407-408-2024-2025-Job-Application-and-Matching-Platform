package Backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity

public class SecurityConfig {
    @Autowired
    AuthenticationProvider authenticationProvider;
    @Autowired
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) //csrf e kapat
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/login/**").permitAll()
                        .anyRequest().authenticated()
                ) // tum http isteklerine yekilendirme gerekli
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                ) // kullanici oturum actıktan sonra id kullanmıyor expression date e bakarak yapıyor
                .authenticationProvider(authenticationProvider) //applicationconfig icindekileri calıstırıyor
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); //kimlik dogrulama ıcın bunu kullandığımızı belirtiyoruz

        return http.build();
    }

}
