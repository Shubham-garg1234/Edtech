package com.edtech.edtch.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edtech.edtch.models.Courses;

@Repository
public interface CoursesRepo extends JpaRepository<Courses,Integer> {
    
}
