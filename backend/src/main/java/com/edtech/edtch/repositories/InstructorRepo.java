package com.edtech.edtch.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.edtech.edtch.models.Instructors;

@Repository
public interface InstructorRepo extends JpaRepository<Instructors,Integer>{
    
}
