package com.edtech.edtch.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edtech.edtch.models.Courses;
import com.edtech.edtch.models.Lectures;

@Repository
public interface LectureRepo extends JpaRepository<Lectures,Integer> {
    @Query("SELECT l FROM Lectures l WHERE l.course = :course")
    List<Lectures> findAllByCourseId(@Param("course") Courses course);
}
