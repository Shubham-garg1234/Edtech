import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const InstructorPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(()=>{
    if(!(user.userName)){
       navigate('/');
       toast("You need to log in to manage your courses.")
    }
  },[])
  
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
          {sampleCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              onClick={() => navigate(`/manageCourses/${course.id}`)}
              role="button"
              tabIndex={0}
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{course.students} students</span>
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

const sampleCourses = [
  {
    id: 1926143760,
    title: "Web Development Fundamentals",
    description: "Learn the basics of web development with HTML, CSS, and JavaScript",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    students: 234,
    lectures: 24,
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Master advanced React concepts and patterns for scalable applications",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    students: 189,
    lectures: 18,
  },
  {
    id: 3,
    title: "Full Stack Development",
    description: "Build complete web applications from frontend to backend",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    students: 156,
    lectures: 32,
  },
];

export default InstructorPanel;