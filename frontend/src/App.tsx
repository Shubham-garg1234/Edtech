import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart"
import Teach from "./pages/Teach"
import AboutCourse from "./pages/AboutCourse";
import { Header } from "./components/Header";
import MyCourses from "./pages/MyCourse";
import CourseContent from "./pages/CourseContent";
import { useAuth } from "./contexts/AuthContext";
import { useCourses } from "./contexts/CourseContext";
import InstructorPanel from "./pages/InstructorPanel";
import CourseManagement from "./components/CourseManagement";
import VideoPlayer from "./util/VideoPlayer";
const queryClient = new QueryClient();

const CoursePage = () => {
  const { CourseId } = useParams(); 
  const { purchasedCourses } = useCourses();

  let exist=false;
  for(let i=0;i<purchasedCourses.length;i++){
    const id=purchasedCourses[i];
    if(id==Number (CourseId)){ 
      exist=true;
      break;
    }
  }
  return exist ? <CourseContent /> : <AboutCourse />;
};

const App = () => {

  const { user } = useAuth();
  return(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<><Header/><Cart /></>} />
          <Route path="/teach" element={<Teach />} />
          <Route path="/myCourses" element={<MyCourses />} />
          <Route path="/Course/:CourseId" element={<CoursePage/>} />
          <Route path="/manageCourses" element={<InstructorPanel/>} />
          <Route path="/manageCourses/:CourseId" element={<CourseManagement/>} />
          <Route path="/player/:key" element={<VideoPlayer />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;