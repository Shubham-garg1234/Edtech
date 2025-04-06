package com.edtech.edtch.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.edtech.edtch.services.VideoService;

@RestController
@RequestMapping("/api/video")
public class VideoUploadController {

    @Autowired
    private VideoService videoService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String lectureName,
            @RequestParam("description") String description,
            @RequestParam("course_id") Integer course_id,
            @RequestParam("duration") String duration
            ) {

        System.out.println("Received file: " + file.getOriginalFilename());
        System.out.println("Lecture name: " + lectureName);
        System.out.println("Description: " + description);
        System.out.println(course_id);
        System.out.println(duration);

        try {
            String uniqueSuffix = "_" + System.currentTimeMillis();
            String videoKey = lectureName.replaceAll("\\s+", "_") + uniqueSuffix;
            String uploadedKey = videoService.uploadFile(file, videoKey, lectureName,description,course_id, duration);
            return ResponseEntity.ok("Video uploaded successfully. Video Key: " + uploadedKey);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error uploading video: " + e.getMessage());
        }
    }

}