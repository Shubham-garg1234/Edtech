package com.edtech.edtch.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.edtech.edtch.models.Topics;

@Repository
public interface TopicsRepo extends JpaRepository<Topics,Integer>{
    
}
