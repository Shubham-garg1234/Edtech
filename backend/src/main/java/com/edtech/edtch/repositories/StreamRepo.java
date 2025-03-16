package com.edtech.edtch.repositories;

import org.springframework.stereotype.Repository;
import com.edtech.edtch.models.Streams;
import com.edtech.edtch.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface StreamRepo extends JpaRepository<Users,Integer>{
    @Query(value = "UPDATE streams SET status = 'active' WHERE stream_id = (SELECT stream_id FROM streams WHERE status = 'inactive' ORDER BY stream_id LIMIT 1) RETURNING *", nativeQuery = true)
    Streams findStream();
}
