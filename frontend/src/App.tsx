import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

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
          <Route path="/Course/:CourseId" element={user.userId ? <AboutCourse /> : <AboutCourse />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;