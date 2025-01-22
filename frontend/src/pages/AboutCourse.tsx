import { AboutCoursePage } from "@/components/AboutCoursePage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AboutCourse = () => {
    const { CourseId } = useParams();
    const [CourseDetails,setCourseDetails]=useState({
        cousrseId: CourseId,
        instructor:{instructorName:"Loading"},
        courseName:"Loading",
        description:"Loading",
        duration:"Loading",
        lectures:0,
        slots:0,
        tests:0,
        startDate:"Loading",
        price:0,
        courseImageURL:"Loading"
    });

    const navigate = useNavigate();
    const { user ,numberOfItemInCart, setNumberOfItemInCart,  } = useAuth();
    
    useEffect(()=>{
      if(!(user.userId)) navigate('/');
      else{
        async function getCourse(){
          const response= await fetch("http://localhost:8081/api/v1/getCourse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ courseId: CourseId , userId: user.userId}),
          });
          const data= await response.json();
          setCourseDetails(data.course);
      }
      getCourse();
      }
    },[]) 


  const handleAddToCart = () => {
    console.log("HI");
    toast({
      title: "Course added to cart",
      description: "You can now proceed to checkout",
      
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <AboutCoursePage
          name={CourseDetails.courseName}
          instructor={CourseDetails.instructor}
          description={CourseDetails.description}
          duration={CourseDetails.duration}
          lectures={CourseDetails.lectures}
          availableSlots={CourseDetails.slots}
          tests={CourseDetails.tests}
          startDate={CourseDetails.startDate}
          price={CourseDetails.price}
          rating={4.5}
          imageUrl={CourseDetails.courseImageURL}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default AboutCourse;