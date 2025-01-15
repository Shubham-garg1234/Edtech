package com.edtech.edtch.repositories;
import org.springframework.stereotype.Repository;
import com.edtech.edtch.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface UserRepo extends JpaRepository<Users,Integer>{
    
}
