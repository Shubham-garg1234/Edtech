package com.edtech.edtch.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.edtech.edtch.models.UserEnrollments;

@Repository
public interface UserEnrollmentRepo extends JpaRepository<UserEnrollments,Integer> {
    @Query(value = "SELECT * FROM user_enrollments WHERE course_course_id = :courseId and user_user_id = :userId", nativeQuery = true)
    Optional<UserEnrollments> findEnrollments(int courseId , int userId);
}
