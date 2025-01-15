package com.edtech.edtch.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edtech.edtch.models.Courses;

@Repository
public interface CoursesRepo extends JpaRepository<Courses,Integer> {
    @Query("SELECT c FROM Courses c WHERE LOWER(c.CourseName) LIKE LOWER(CONCAT('%', :CourseName, '%'))")
    List<Courses> findCoursesByCourseNameContaining(@Param("CourseName") String CourseName);

    @Query("SELECT c FROM Courses c WHERE LOWER(c.Description) LIKE LOWER(CONCAT('%', :Description, '%'))")
    List<Courses> findCoursesByDescriptionContaining(@Param("Description") String Description);
}
