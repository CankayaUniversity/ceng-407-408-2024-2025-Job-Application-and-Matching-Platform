package Backend.repository;

import Backend.entities.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    //jwt den parse edilen veride email e gore password kontrol edilecek
    Optional<User> findByEmail(String email);
}
