package com.edtech.edtch.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.edtech.edtch.models.CourseResponse;
import com.edtech.edtch.models.Courses;
import com.edtech.edtch.models.SearchResult;
import com.edtech.edtch.models.UserEnrollments;
import com.edtech.edtch.models.Users;
import com.edtech.edtch.repositories.CoursesRepo;
import com.edtech.edtch.repositories.InstructorRepo;
import com.edtech.edtch.repositories.UserEnrollmentRepo;
import com.edtech.edtch.repositories.UserRepo;
import com.edtech.edtch.models.Instructors;
import com.edtech.edtch.models.MyCourseResponse;

import jakarta.transaction.Transactional;

@Service
public class CourseService {

    @Autowired
    private CoursesRepo coursesRepo;

    @Autowired
    private InstructorRepo instructorRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserEnrollmentRepo userEnrollmentRepo;

    public List<Courses> getAllCourses() {
        return coursesRepo.findAll();
    }

    public CourseResponse getCourse(int courseId , int userId) {
        Courses course = coursesRepo.findById(courseId).orElse(null);
        Optional<UserEnrollments> existingEnrollment = userEnrollmentRepo.findEnrollments(courseId , userId);

        int enrollmentStatus = existingEnrollment.isPresent() ? 1 : 0;

        CourseResponse courseResponse = new CourseResponse();
        courseResponse.setBought(enrollmentStatus);
        courseResponse.setCourse(course);
        return courseResponse;
    }

    public List<Courses> getFeatured() {
        Pageable top3 = PageRequest.of(0, 3);
        return coursesRepo.findAll(top3).getContent();
    }

    public List<SearchResult> getLike(String title) {
        if (title == "")
            return new ArrayList<SearchResult>();
        List<Courses> coursesByTitle = coursesRepo.findCoursesByCourseNameContaining(title);
        List<Courses> coursesByDescription = coursesRepo.findCoursesByDescriptionContaining(title);
        coursesByDescription.removeAll(coursesByTitle);
        coursesByTitle.addAll(coursesByDescription);
        List<SearchResult> final_output = new ArrayList<>();
        for (Courses course : coursesByTitle) {
            SearchResult result = new SearchResult(course.getCourseId(), course.getCourseName());
            final_output.add(result);
        }
        return final_output;
    }

    @Transactional
    public Courses addCourse(Courses course, int userId) {
        if (course == null) {
            throw new IllegalArgumentException("Course cannot be null");
        }
        Optional<Instructors> existingInstructor = instructorRepo.findInstructorByUserId(userId);
        Instructors instructor;

        if (existingInstructor.isPresent()) {
            instructor = existingInstructor.get();
            System.out.println("Instructor already exists");
        } else {
            Users user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            instructor = new Instructors();
            instructor.setUser(user);
            instructor.setQualifications(course.getInstructor().getQualifications());
            instructor.setExperience(course.getInstructor().getExperience());
            instructor.setInstructorName(course.getInstructor().getInstructorName());
            instructor = instructorRepo.save(instructor);
        }
        course.setInstructor(instructor);
        return coursesRepo.save(course);
    }

    public List<MyCourseResponse> getCartItems(int userId) {
        List<Integer> coursesId = userEnrollmentRepo.findByUserId(userId);
        List<Courses> myCoursesDetails= coursesRepo.findAllById(coursesId);
        List<MyCourseResponse> myCourses = new ArrayList<>();;
        for(Courses course: myCoursesDetails){
            MyCourseResponse myCourse = new MyCourseResponse();
            myCourse.setCourseId(course.getCourseId());
            myCourse.setCourseImageURL(course.getCourseImageURL());
            myCourse.setCourseName(course.getCourseName());
            myCourse.setInstructorName(course.getInstructor().getInstructorName());
            myCourses.add(myCourse);
        }
        return myCourses;
    }

}
