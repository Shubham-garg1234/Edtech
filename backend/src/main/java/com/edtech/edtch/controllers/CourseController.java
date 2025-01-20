package com.edtech.edtch.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edtech.edtch.models.CourseRequest;
import com.edtech.edtch.models.CourseResponse;
import com.edtech.edtch.models.Courses;
import com.edtech.edtch.models.SearchResult;
import com.edtech.edtch.services.CourseService;

@RestController
@CrossOrigin
@RequestMapping("/api/v1")
public class CourseController {

    @Autowired
    private CourseService courseService;
    


    @GetMapping("/getAllCourses")
    public List<Courses> getAllCourses() {
        return courseService.getAllCourses();
    }



    @PostMapping("/getCourse")
    public ResponseEntity<?> getCourse(@RequestBody CourseRequest courseRequest) {

        CourseResponse courseResponse = courseService.getCourse(courseRequest.getCourseId() , courseRequest.getUserId());
        if(courseResponse.getCourse()!=null)
        return new ResponseEntity<>(courseResponse,HttpStatus.OK);
        else
        return new ResponseEntity<>(courseResponse,HttpStatus.NOT_FOUND);
    }


    @GetMapping("/getFeaturedCourses")
    public List<Courses> getFeatured() {
        return courseService.getFeatured();
    }

    @PostMapping("/getLike")
    public List<SearchResult> getLike(@RequestBody String str){
        return courseService.getLike(str);
    }

    @PostMapping("/addCourse/{userId}")
    public Courses addCourse(@RequestBody Courses course, @PathVariable int userId) {
        System.out.println(userId);
        return courseService.addCourse(course, userId);
    }
}
