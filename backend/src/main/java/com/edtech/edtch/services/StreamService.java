package com.edtech.edtch.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.edtech.edtch.repositories.StreamRepo;

@Service
public class StreamService {
    @Autowired
    StreamRepo streamRepo;

    public ResponseEntity<?> prepareStream(int courseId) {
        int updatedRows = streamRepo.prepareStream(courseId);
        if (updatedRows > 0) {
            return ResponseEntity.ok("Stream prepared successfully.");
        } else {
            return ResponseEntity.badRequest().body("Stream preparation failed.");
        }
    }

    public ResponseEntity<?> endStream(int courseId) {
        int updatedRows = streamRepo.endStream(courseId);
        if (updatedRows > 0) {
            return ResponseEntity.ok("Stream ended successfully.");
        } else {
            return ResponseEntity.badRequest().body("Stream ending failed.");
        }
    }

    public ResponseEntity<?> checkStream(int courseId) {
        boolean isStreamRunning = streamRepo.checkStream(courseId);
        if (!isStreamRunning) {
            return ResponseEntity.ok("Stream is not running.");
        } else {
            return ResponseEntity.badRequest().body("Stream is running.");
        }
    }

}
