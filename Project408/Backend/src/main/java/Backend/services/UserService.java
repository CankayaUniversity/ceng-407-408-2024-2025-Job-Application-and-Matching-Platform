package Backend.services;

import Backend.entities.user.User;

public interface UserService {
    User getUserByEmail(String email);
    User getUserById(Integer id); // Added for completeness, might be useful later
} 