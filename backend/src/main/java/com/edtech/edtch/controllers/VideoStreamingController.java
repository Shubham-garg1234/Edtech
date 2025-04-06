package com.edtech.edtch.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.IOException;

@RestController
@RequestMapping("/api/video")
public class VideoStreamingController {
    
    @Autowired
    private com.edtech.edtch.services.VideoService videoService;
    
    @GetMapping("/{videoKey}")
    public ResponseEntity<StreamingResponseBody> streamVideo(
            @PathVariable String videoKey,
            @RequestHeader(value = "Range", required = false) String range) throws IOException {
        return videoService.getVideoStream(videoKey, range);
    }
}