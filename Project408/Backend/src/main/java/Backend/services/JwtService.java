package Backend.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${SECRET_KEY}")
    private String SECRET_KEY;

    public String extractEmail(String jwt) {
        return extractClaim(jwt, Claims::getSubject);
    }
    public <T> T extractClaim(String jwt, Function<Claims, T> claimsResolver) {
        final Claims claims=extractAllClaims(jwt);
        return claimsResolver.apply(claims);
    }
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return generateToken(claims, userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 48))// how long this token valid 24 hours 1000 milliseconds;
                .signWith(getSignInKey())
                .compact();

    }
    //userdetails daki email ve token daki aynı mı kontrol ve token expired oldu mu
    public boolean isTokenValid(String jwt, UserDetails userDetails){
        final String email = extractEmail(jwt);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(jwt));
    }
    private boolean isTokenExpired(String jwt){
        return extractExpiration(jwt).before(new Date());
    }
    private Date extractExpiration(String jwt){
        return extractClaim(jwt, Claims::getExpiration);
    }
    private Claims extractAllClaims(String jwt) {
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseClaimsJws(jwt)
                .getBody();
    }


    private SecretKey getSignInKey() {
        byte[] key = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(key);
    }


}
