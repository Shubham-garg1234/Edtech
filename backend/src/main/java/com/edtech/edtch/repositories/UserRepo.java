package com.edtech.edtch.repositories;
import org.springframework.stereotype.Repository;
import com.edtech.edtch.models.Users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface UserRepo extends JpaRepository<Users,Integer>{
    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Users findByEmail(String email);
}
