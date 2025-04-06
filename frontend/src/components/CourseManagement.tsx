import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { Video, FileText, Radio, Bell, PlayCircle, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import VideoPlayer from "../util/VideoPlayer.jsx";

const CourseManagement = () => {
  const navigate = useNavigate();
  const { CourseId } = useParams();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDescription, setLectureDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [CourseDetails, setCourseDetails] = useState({
    title: "Unknown",
    description: "Unknown",
    image: "Unknown",
    lectures: 0,
    students: 0,
    content: [],});

  useEffect(()=>{
        if(!(user.userName)) navigate('/');
        else{
          async function getCourseManagementDetails(){
            const response= await fetch("http://localhost:8081/api/getCourseManagementDetails", {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ courseId: CourseId}),
            });
            const data= await response.json();
            const content_data = [
              {
                title: "General",
                lectures: data.content.map((lecture) => ({
                  title: lecture.title,
                  description: lecture.description,
                  duration: lecture.duration,
                  key: lecture.key,
                  type: "video",
                })),
              },
            ];
            
            setCourseDetails({
              title: data.course.courseName,
              description: data.course.description,
              image: data.course.courseImageURL || "https://tse2.mm.bing.net/th?id=OIP.JYDLll34aYDNbDUk2j81ZQHaEO&pid=Api&P=0&h=220",
              lectures: data.course.lectures,
              students: data.course.slots,
              content: content_data || []
            });

        }
        getCourseManagementDetails();
        }
      },[]) 

  const handleGoLive = () => {
    console.log("Going live");
  };

  const handleLectureUpload = async () => {
    if (!lectureTitle || !selectedFile) {
      alert("Lecture title and video file are required.");
      return;
    }
  
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = async () => {
      window.URL.revokeObjectURL(video.src);
      const durationInSeconds = video.duration;
  
      const formatted = new Date(durationInSeconds * 1000).toISOString().substr(11, 8);
  
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", lectureTitle);
      formData.append("description", "Sample desc"); // You can include a field for this
      formData.append("duration", formatted);
      formData.append("course_id", CourseId);
  
      try {
        const response = await fetch("http://localhost:8081/api/video/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.text();
        alert(result);
      } catch (error) {
        alert("Error uploading video: " + error.message);
      }
    };
  
    video.src = URL.createObjectURL(selectedFile);
  };
  
  

  const managementOptions = [
    {
      title: "Add New Lecture",
      description: "Upload new video lectures or content",
      icon: Video,
      action: () => setOpenDialog(true),
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
      action: () => handleGoLive(),
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={CourseDetails.image}
              alt={CourseDetails.title}
              className="w-full md:w-64 h-48 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{CourseDetails.title}</h1>
              <p className="text-gray-600 mb-4">{CourseDetails.description}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <PlayCircle className="w-4 h-4" />
                  {CourseDetails.lectures} lectures
                </span>
                <span>{CourseDetails.students} enrolled students</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="content" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="management">Course Management</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <div className="space-y-4">
              {CourseDetails.content.map((section, index) => (
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
                        onClick={() =>
                          navigate(`/player/${lecture.key}`, {
                            state: { title: lecture.title }
                          })
                        }
                        
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
          </TabsContent>

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

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Lecture</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="lecture-title">Lecture Title</Label>
                <br></br>
                <br></br>
                <Input
                  id="lecture-title"
                  placeholder="Enter lecture title"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                />
              </div>
              
              <div>
                <br />
                <Label htmlFor="lecture-description">Lecture Description</Label>
                <br />
                <br />
                <Input
                  id="lecture-description"
                  placeholder="Enter lecture description"
                  value={lectureDescription}
                  onChange={(e) => setLectureDescription(e.target.value)}
                />
              </div>

              <div>
              <br></br>
                <Label htmlFor="video-file">Select Video File</Label>
                <br></br>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </div>
              <Button className="w-full" onClick={handleLectureUpload}>
                Upload Lecture
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </div>  
    </div>
  );
};
// const sampleCourses = [
//   {
//     CourseId: 1528465928,
//     title: "Web Development Fundamentals",
//     description: "Learn the basics of web development with HTML, CSS, and JavaScript",
//     image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
//     students: 234,
//     lectures: 24,
//     content: [
//       {
//         title: "Getting Started with Web Development",
//         lectures: [
//           {
//             title: "Introduction to HTML",
//             type: "video",
//             duration: "15:30"
//           },
//           {
//             title: "Basic HTML Tags",
//             type: "video",
//             duration: "20:45"
//           },
//           {
//             title: "HTML Exercise Files",
//             type: "document",
//             duration: "10 pages"
//           }
//         ]
//       },
//       {
//         title: "CSS Fundamentals",
//         lectures: [
//           {
//             title: "CSS Selectors",
//             type: "video",
//             duration: "18:20"
//           },
//           {
//             title: "Box Model Explained",
//             type: "video",
//             duration: "22:15"
//           }
//         ]
//       }
//     ]
//   },
// ];

export default CourseManagement;