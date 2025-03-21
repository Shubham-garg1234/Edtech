import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { LessonList } from "@/components/LessonList";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { useNavigate } from "react-router-dom";
import HLSPlayer from "./HLSPlayer";

const CourseContent = () => {
  const { id } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(0);
  const navigate =useNavigate();
  
  // Sample data - in a real app this would come from an API
  const course = {
    id: 1926143760,
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    isLive: true,
    lessons: [
      { id: 1, title: "Introduction to Web Development", type: "video" as const, duration: "10:00", completed: true },
      { id: 2, title: "HTML Fundamentals", type: "video" as const, duration: "15:00", completed: true },
      { id: 3, title: "HTML Quiz", type: "test" as const, duration: "20 mins", completed: false },
      { id: 4, title: "CSS Basics", type: "video" as const, duration: "20:00", completed: false },
      { id: 5, title: "CSS Layout", type: "video" as const, duration: "25:00", completed: false },
      { id: 6, title: "CSS Assessment", type: "test" as const, duration: "30 mins", completed: false },
    ],
  };

  const [streamStatus, setStreamStatus] = useState("offline");

  const checkStream = async () => {
      const response = await fetch("http://localhost:8081/api/checkStream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course.id)
      });
      if(response.ok){
        setStreamStatus("offline");
      }
      else setStreamStatus("live");
    };
  
    useEffect(() => {
      checkStream();
    }, []);

  return (
    <Container>

      <div className="py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 flex items-center hover:text-gray-900"
        >
          <span className="mr-1">←</span> Back
        </button>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600">Instructor: {course.instructor}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {streamStatus === "live" && (
              <div className="mb-6">
                <LiveBadge />
                <HLSPlayer streamUrl = "https://lxr584.egress.xr65xh.mediapackagev2.eu-north-1.amazonaws.com/out/v1/Edtech/channel1/ep/index.m3u8" />
              </div>
            )}
            <VideoPlayer isLive={false} lesson={course.lessons[selectedLesson]} />
          </div>
          
          <div className="lg:col-span-1">
            <LessonList 
              lessons={course.lessons}
              selectedLesson={selectedLesson}
              onSelectLesson={setSelectedLesson}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CourseContent;