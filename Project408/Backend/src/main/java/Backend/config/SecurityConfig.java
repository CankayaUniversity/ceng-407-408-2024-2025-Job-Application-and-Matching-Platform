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
<<<<<<< HEAD
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
=======
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
>>>>>>> features2-login

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
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(AntPathRequestMatcher.antMatcher("/h2-console/**"))
                        .disable()
                )
                // H2 Console için frame options'ı devre dışı bırak
                .headers(headers -> headers
                        .frameOptions()
                        .sameOrigin()
                )
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        // Public endpointler
                        .requestMatchers("/login/**").permitAll()
                        // H2 Console
                        .requestMatchers("/h2-console/**").permitAll()
                        // Swagger UI
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        // Actuator endpoints
                        .requestMatchers("/actuator/**").permitAll()
                        // Diğer tüm istekler için authentication gerekli
                        .anyRequest().authenticated()
                )
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
<<<<<<< HEAD
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
=======
                ) // kullanici oturum actıktan sonra id kullanmıyor expression date e bakarak yapıyor
                .authenticationProvider(authenticationProvider) //applicationconfig icindekileri calıstırıyor
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())); // Enable CORS support
        ; //kimlik dogrulama ıcın bunu kullandığımızı belirtiyoruz

        return http.build();
    }
    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173"); // Replace with your frontend URL
        configuration.addAllowedMethod("GET");
        configuration.addAllowedMethod("POST");
        configuration.addAllowedMethod("PUT");
        configuration.addAllowedMethod("DELETE");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply CORS configuration to all routes
        return source;
    }

>>>>>>> features2-login
}
