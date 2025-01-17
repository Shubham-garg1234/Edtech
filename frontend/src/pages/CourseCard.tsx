import { CourseCardLarge } from "@/components/CourseCardLarge";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const CourseCard = () => {
    const { CourseId } = useParams();
    const [CourseDetails,setCourseDetails]=useState({
        cousrseId: CourseId,
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


  const handleAddToCart = () => {
    console.log("HI");
    toast({
      title: "Course added to cart",
      description: "You can now proceed to checkout",
      
    });
  };

  useEffect(()=>{
    async function getDetails(){
        const response= await fetch("http://localhost:8081/api/v1/getCourse/"+CourseId);
        const data= await response.json();
        setCourseDetails(data);
    }
    getDetails();
  },[])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <CourseCardLarge
          name={CourseDetails.courseName}
          instructor="John Smith"
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

export default CourseCard;