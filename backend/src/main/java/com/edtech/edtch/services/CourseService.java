package com.edtech.edtch.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edtech.edtch.models.Courses;
import com.edtech.edtch.repositories.CoursesRepo;

@Service
public class CourseService {

    @Autowired
    CoursesRepo coursesRepo;

    public List<Courses> getFeaturedCourses(){
        List<Courses> cd=null;
        return cd;
    }
    
}
