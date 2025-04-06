package com.edtech.edtch.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.edtech.edtch.models.CourseResponse;
import com.edtech.edtch.models.Courses;
import com.edtech.edtch.models.SearchResult;
import com.edtech.edtch.models.UserEnrollments;
import com.edtech.edtch.models.Users;
import com.edtech.edtch.repositories.CoursesRepo;
import com.edtech.edtch.repositories.InstructorRepo;
import com.edtech.edtch.repositories.LectureRepo;
import com.edtech.edtch.repositories.UserEnrollmentRepo;
import com.edtech.edtch.repositories.UserRepo;
import com.edtech.edtch.utils.JwtUtil;
import com.edtech.edtch.models.Instructors;
import com.edtech.edtch.models.Lectures;
import com.edtech.edtch.models.MyCourseResponse;

import jakarta.transaction.Transactional;

@Service
public class CourseService {

    @Autowired
    private CoursesRepo coursesRepo;

    @Autowired
    private InstructorRepo instructorRepo;

    @Autowired
    private LectureRepo lectureRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserEnrollmentRepo userEnrollmentRepo;

    @Autowired
    private JwtUtil jwtUtil;

    public List<Courses> getAllCourses() {
        return coursesRepo.findAll();
    }

    public CourseResponse getCourse(int courseId, String accessToken) {
        String userId_str = jwtUtil.validateToken(accessToken).getSubject();
        int userId = Integer.parseInt(userId_str);
        System.out.println("-------------------------------------------------");
        System.out.println(userId_str);
        System.out.println("-------------------------------------------------");

        Courses course = coursesRepo.findById(courseId).orElse(null);
        Optional<UserEnrollments> existingEnrollment = userEnrollmentRepo.findEnrollments(courseId, userId);

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
    public ResponseEntity<?> registerCourse(String accessToken, Courses course) {
        String userId = jwtUtil.validateToken(accessToken).getSubject();
        Users user = userRepo.findById(Integer.parseInt(userId)).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("User Not Found");
        }

        Optional<Instructors> existingInstructor = instructorRepo.findInstructorByUserId(user.getUserId());
        Instructors instructor;

        if (existingInstructor.isPresent()) {
            instructor = existingInstructor.get();
        } else {
            instructor = new Instructors();
            instructor.setUser(user);
            instructor.setQualifications(course.getInstructor().getQualifications());
            instructor.setExperience(course.getInstructor().getExperience());
            instructor.setInstructorName(course.getInstructor().getInstructorName());
            instructor = instructorRepo.save(instructor);
        }
        course.setInstructor(instructor);
        coursesRepo.save(course);
        return ResponseEntity.status(200).body("Course Registered Successfully");
    }

    public List<MyCourseResponse> getMyCourses(String accessToken) {
        String userId_str = jwtUtil.validateToken(accessToken).getSubject();
        int userId = Integer.parseInt(userId_str);
        List<Integer> coursesId = userEnrollmentRepo.findByUserId(userId);
        List<Courses> myCoursesDetails = coursesRepo.findAllById(coursesId);
        List<MyCourseResponse> myCourses = new ArrayList<>();
        ;
        for (Courses course : myCoursesDetails) {
            MyCourseResponse myCourse = new MyCourseResponse();
            myCourse.setCourseId(course.getCourseId());
            myCourse.setCourseImageURL(course.getCourseImageURL());
            myCourse.setCourseName(course.getCourseName());
            myCourse.setInstructorName(course.getInstructor().getInstructorName());
            myCourses.add(myCourse);
        }
        return myCourses;
    }

    public ResponseEntity<?> getInstructorCourses(String accessToken) {
        try {
            String userId_str = jwtUtil.validateToken(accessToken).getSubject();
            int userId = Integer.parseInt(userId_str);

            Optional<Instructors> existingInstructor = instructorRepo.findInstructorByUserId(userId);
            if (existingInstructor.isPresent()) {
                Instructors instructor = existingInstructor.get();
                List<Courses> courses = coursesRepo.findByInstructor(instructor);

                List<Map<String, Object>> response = new ArrayList<>();

                for (Courses course : courses) {
                    Map<String, Object> courseData = new HashMap<>();
                    if (course.getInstructor().getUser().getUserId() == userId) {
                        courseData.put("id", course.getCourseId());
                        courseData.put("title", course.getCourseName());
                        courseData.put("description", course.getDescription());
                        courseData.put("image", course.getCourseImageURL());
                        courseData.put("students", course.getSlots());
                        courseData.put("lectures", course.getLectures());
                        response.add(courseData);
                    }
                }

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Instructor not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
    }

    public ResponseEntity<?> addCourse(Courses course, String accessToken) {
        String userId_str = jwtUtil.validateToken(accessToken).getSubject();
        int userId = Integer.parseInt(userId_str);
        coursesRepo.save(course);
        return ResponseEntity.ok("OK");
    }

    public ResponseEntity<?> getCourseManagementDetails(int courseId, String accessToken) {
        String userId_str = jwtUtil.validateToken(accessToken).getSubject();
        int userId = Integer.parseInt(userId_str);

        Optional<Courses> optionalCourse = coursesRepo.findById(courseId);
        if (optionalCourse.isPresent()) {
            Courses course = optionalCourse.get();

            if (course.getInstructor().getUser().getUserId() != userId) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User Not Authorized to modify the course");
            }
            List<Lectures> content = lectureRepo.findAllByCourseId(course);
            Map<String, Object> response = new HashMap<>();
            response.put("course", course);
            response.put("content", content);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found");
        }
    }

}
