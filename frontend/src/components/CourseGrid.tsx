import { useNavigate } from "react-router-dom";
import { CourseCard } from "./CourseGridCourseCard";
import { useEffect,useState } from "react";


export const CourseGrid = () => {

  const [courses,setcourses]=useState([]);
  const navigate = useNavigate();

  async function fetchData(){
    try{
      const response= await fetch("http://localhost:8081/api/getFeaturedCourses");
      const data=await response.json();
      
      data.map((course: any)=>{
        setcourses((prevCourses)=>[...prevCourses,course])
      })
      
      }catch(err){
        console.log(err);
      }
    }
  
  useEffect(()=>{
    fetchData();
  },[])

  return (
    <div className="container py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard onClick={() => { navigate("/Course/" + course.courseId); } } key={course.courseId} title={course.courseName} instructor={course.instructor.instructorName} price={course.price} rating={4.8} image={course.courseImageURL} />
        ))}
      </div>
    </div>
  );
};