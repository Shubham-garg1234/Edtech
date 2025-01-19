import { useNavigate } from "react-router-dom";
import { CourseCard } from "./CourseGridCourseCard";
import { useEffect,useState } from "react";


export const CourseGrid = () => {

  const [courses,setcourses]=useState([]);
  const navigate = useNavigate();

  async function fetchData(){
    try{
    const response= await fetch("http://localhost:8081/api/v1/getFeaturedCourses");

    const data=await response.json();
    console.log(data);
    setcourses([
      {
        id: data[0].courseId,
        title: data[0].courseName,
        instructor: data[0].instructor.instructorName,
        price: data[0].price,
        rating: 4.8,
        image: data[0].courseImageURL,
      },
      {
        id: data[1].courseId,
        title: data[1].courseName,
        instructor: data[1].instructor.instructorName,
        price: data[1].price,
        rating: 4.6,
        image: data[1].courseImageURL,
      },
      {
        id: data[2].courseId,
        title: data[2].courseName,
        instructor: data[2].instructor.instructorName,
        price: data[2].price,
        rating: 4.7,
        image: data[2].courseImageURL,
      },
    ]);
    
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
          <CourseCard onClick={() => {navigate("/Course/"+course.id)}}  key={course.id} {...course }/>
        ))}
      </div>
    </div>
  );
};