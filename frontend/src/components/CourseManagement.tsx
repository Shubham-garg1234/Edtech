import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Video, FileText, Radio, Bell, PlayCircle, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

const CourseManagement = () => {
  const navigate = useNavigate();  
  const courseId = window.location.pathname.split('/').pop();

  const [course , setCourse] = useState(null);

  useEffect(() => {
    const getCourse = async () => {
      try{
        const response = await fetch(`http://localhost:8081/getCourseById`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(courseId)
        });
        const data = await response.json();
        setCourse(data);
      }
      catch(error){
        console.error("Error fetching course: ", error);
        navigate('/');
      }
    }
    getCourse();
  }, [])


  const managementOptions = [
    {
      title: "Add New Lecture",
      description: "Upload new video lectures or content",
      icon: Video,
      action: () => console.log("Add lecture"),
    },
    {
      title: "Create Test",
      description: "Create assessments and quizzes",
      icon: FileText,
      action: () => console.log("Create test"),
    },
    {
      title: "Go Live",
      description: "Start a live streaming session",
      icon: Radio,
      action: () => {navigate(`/liveStream/${courseId}`)},
    },
    {
      title: "Make Announcement",
      description: "Send updates to enrolled students",
      icon: Bell,
      action: () => console.log("Make announcement"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/manageCourses')}
          className="mb-6"
        >
          ← Back to Courses
        </Button>

        {course !== null ?
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={course.courseImageURL}
                alt={course.courseName}
                className="w-full md:w-64 h-48 object-cover rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.courseName}</h1>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    {course.lectures} lectures
                  </span>
                  <span>{course.slots} enrolled students</span>
                </div>
              </div>
            </div>
          </div>
          :
          <div></div>
        }
        
        <Tabs defaultValue="content" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="management">Course Management</TabsTrigger>
          </TabsList>
          
          {/* <TabsContent value="content">
            <div className="space-y-4">
              {course.content.map((section, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    {section.title}
                  </h3>
                  <div className="space-y-3">
                    {section.lectures.map((lecture, lectureIndex) => (
                      <div 
                        key={lectureIndex}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        {lecture.type === 'video' ? (
                          <Video className="w-5 h-5 text-blue-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-600" />
                        )}
                        <div>
                          <h4 className="font-medium">{lecture.title}</h4>
                          <p className="text-sm text-gray-500">{lecture.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent> */}
          
          <TabsContent value="management">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {managementOptions.map((option) => (
                <Card
                  key={option.title}
                  className="p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={option.action}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <option.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                      <p className="text-gray-600">{option.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseManagement;