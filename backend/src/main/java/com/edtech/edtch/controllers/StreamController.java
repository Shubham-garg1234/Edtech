package com.edtech.edtch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.edtech.edtch.services.StreamService;

@RestController
@CrossOrigin
public class StreamController {

    @Autowired
    StreamService streamService;

    @PostMapping("/api/prepareStream")
    public ResponseEntity<?> prepareStream(@RequestBody int courseId) {
        return streamService.prepareStream(courseId);
    }

    @PostMapping("/api/endStream")
    public ResponseEntity<?> endStream(@RequestBody int courseId) {
        return streamService.endStream(courseId);
    }

    @PostMapping("/api/checkStream")
    public ResponseEntity<?> checkStream(@RequestBody int courseId) {
        return streamService.checkStream(courseId);
    }
}
