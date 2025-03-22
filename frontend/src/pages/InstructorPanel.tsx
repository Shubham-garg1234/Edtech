import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const InstructorPanel = () => {
  const navigate = useNavigate();
  const [courses , setCourses] = useState([]);

  const getCourses = async () => {
    try{
      const response = await fetch("http://localhost:8081/getInstructorCourses", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await response.json();
      setCourses(data);
    }
    catch(error){
      console.error("Error fetching courses: ", error);
      navigate('/');
      toast("You need to log in to manage your courses.")
    }
  }

  useEffect(() => {
    getCourses();
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          ← Back
        </Button>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={()=>navigate('/teach')}>
            Add New Course
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.courseId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              onClick={() => navigate(`/manageCourses/${course.courseId}`)}
              role="button"
              tabIndex={0}
            >
              <img
                src={course.courseImageURL}
                alt={course.courseName}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.courseName}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{course.slots} slots</span>
                  <span>{course.lectures} lectures</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorPanel;
