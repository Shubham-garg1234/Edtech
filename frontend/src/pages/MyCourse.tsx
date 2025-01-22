import { MyCourseCourseCard } from "@/components/MyCourseCourseCard";
import { Container } from "@/components/ui/Container";
import { useCourses } from "@/contexts/CourseContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  const { purchasedCourses,myCourses } = useCourses();
  const [courses,setCourses]= useState(myCourses);
  const navigate= useNavigate();

  return (
    <Container>
      <button
        onClick={() => { navigate("/"); }}
        className="absolute top-6 left-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-colors"
      >
        Back
      </button>
      <div className="py-8">  
        <h1 className="text-3xl font-bold mb-6 text-center">My Courses</h1>
        <br/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <MyCourseCourseCard
              onClick={() => {navigate("/Course/"+course.courseId)}}
              key={course.courseId}
              {...course}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default MyCourses;