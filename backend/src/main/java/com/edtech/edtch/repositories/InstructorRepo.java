package com.edtech.edtch.repositories;

import org.springframework.stereotype.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edtech.edtch.models.Instructors;

@Repository
public interface InstructorRepo extends JpaRepository<Instructors,Integer>{
    @Query("SELECT i FROM Instructors i WHERE i.user.UserId = :userId")
    Optional<Instructors> findInstructorByUserId(@Param("userId") int userId);
}
