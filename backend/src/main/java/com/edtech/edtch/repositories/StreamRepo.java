package com.edtech.edtch.repositories;

import org.springframework.stereotype.Repository;
import com.edtech.edtch.models.Streams;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface StreamRepo extends JpaRepository<Streams,Integer>{
    @Modifying
    @Transactional
    @Query(value = "UPDATE streams SET status = 'active' WHERE stream_id = (SELECT stream_id FROM streams WHERE status = 'inactive' ORDER BY stream_id LIMIT 1) RETURNING *", nativeQuery = true)
    Streams findStream();

    @Modifying
    @Transactional
    @Query(value = "UPDATE streams SET status = 'running' WHERE stream_id = (SELECT stream_id FROM courses WHERE course_id = :courseId) AND status = 'active'", nativeQuery = true)
    int prepareStream(int courseId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE streams SET status = 'active' WHERE stream_id = (SELECT stream_id FROM courses WHERE course_id = :courseId) AND status = 'running'", nativeQuery = true)
    int endStream(int courseId);

    @Transactional
    @Query(value = "SELECT EXISTS(SELECT 1 FROM streams WHERE stream_id = (SELECT stream_id FROM courses WHERE course_id = :courseId) AND status = 'running')", nativeQuery = true)
    boolean checkStream(int courseId);

    @Transactional
    @Query(value = "SELECT stream_url FROM streams WHERE stream_id = (SELECT stream_id FROM courses WHERE course_id = :courseId)", nativeQuery = true)
    String getStreamFromCourse(int courseId);
}
