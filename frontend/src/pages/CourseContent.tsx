import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { useNavigate } from "react-router-dom";
import HLSPlayer from "./HLSPlayer";

const CourseContent = () => {
  const navigate =useNavigate();
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

  const [streamStatus, setStreamStatus] = useState("offline");

  const checkStream = async () => {
      const response = await fetch("http://localhost:8081/api/checkStream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseId)
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
        {course !== null ? 
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{course.courseName}</h1>
              <p className="text-gray-600">Instructor: {course.instructor.instructorName}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {streamStatus === "live" && (
                  <div className="mb-6">
                    <LiveBadge />
                    <HLSPlayer streamUrl = {`https://lxr584.egress.xr65xh.mediapackagev2.eu-north-1.amazonaws.com/out/v1/Edtech/channel${course.stream.streamId}/ep/index.m3u8`} />
                  </div>
                )}
                <VideoPlayer isLive={false} lesson={{title: "", type: ""}} />
              </div>
              
              {/* <div className="lg:col-span-1">
                <LessonList 
                  lessons={course.lessons}
                  selectedLesson={selectedLesson}
                  onSelectLesson={setSelectedLesson}
                />
              </div> */}
            </div>
          </div>
        :
          <div></div>
        }
      </div>
    </Container>
  );
};

export default CourseContent;