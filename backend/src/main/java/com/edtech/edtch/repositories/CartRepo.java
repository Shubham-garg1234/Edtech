package com.edtech.edtch.repositories;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.edtech.edtch.models.Cart;

@Repository
public interface CartRepo extends JpaRepository<Cart,Integer> {
    
    @Query("SELECT c.course.CourseId FROM Cart c WHERE c.user.UserId = :userId")
    List<Integer>findAllByUserId(int userId);

    @Modifying
    @Query("Delete FROM Cart c WHERE c.user.UserId = :userId AND c.course.CourseId = :courseId")
    int deleteItem(int userId, int courseId);

    @Query("SELECT COUNT(c) FROM Cart c WHERE c.user.UserId = :userId")
    int countByUserId(int userId);

}
