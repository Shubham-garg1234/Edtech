package com.edtech.edtch.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.edtech.edtch.models.Courses;
import com.edtech.edtch.models.SearchResult;
import com.edtech.edtch.services.CourseService;

@RestController
@CrossOrigin
public class CourseController {

    @Autowired
    private CourseService courseService;
    
    @GetMapping("/api/getAllCourses")
    public List<Courses> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping("/api/getCourse")
    public ResponseEntity<?> getCourse(@CookieValue(required = false) String accessToken , @RequestBody Integer courseId) {
        return courseService.getCourse(accessToken , courseId);
    }

    @GetMapping("/api/getFeaturedCourses")
    public List<Courses> getFeatured() {
        return courseService.getFeatured();
    }

    @PostMapping("/api/getLike")
    public List<SearchResult> getLike(@RequestBody String str){
        return courseService.getLike(str);
    }

    @PostMapping("/registerCourse")
    public ResponseEntity<?> registerCourse(@CookieValue(required = true) String accessToken , @RequestBody Courses course) {
        return courseService.registerCourse(accessToken , course);
    }
}
