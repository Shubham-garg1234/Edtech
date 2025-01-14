package com.edtech.edtch.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edtech.edtch.models.Courses;
import com.edtech.edtch.services.CourseService;

@RestController
@RequestMapping("/api/v1")
public class CourseController {

    @Autowired
    CourseService courseService;

    @GetMapping("/getFeaturedCourses")
    public List<Courses> getFeaturedCourses(){
        return courseService.getFeaturedCourses();
    }
}
