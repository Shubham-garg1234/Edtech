package com.edtech.edtch.repositories;
import org.springframework.stereotype.Repository;
import com.edtech.edtch.models.Users;

import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepo extends JpaRepository<Users,Integer>{
    // @Query("SELECT u FROM Users u WHERE u.UserId = :userId")
    // Optional<Users> findUserByUserId(@Param("userId") int userId);

    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Users findByEmail(String email);
}
