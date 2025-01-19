import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { LessonList } from "@/components/LessonList";
import { LiveBadge } from "@/components/ui/LiveBadge";

const CourseContent = () => {
  const { id } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(0);
  
  // Sample data - in a real app this would come from an API
  const course = {
    id: 1,
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

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600">Instructor: {course.instructor}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {course.isLive && (
              <div className="mb-6">
                <LiveBadge />
                <VideoPlayer isLive={true} />
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