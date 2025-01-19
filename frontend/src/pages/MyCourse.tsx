import { MyCourseCourseCard } from "@/components/MyCourseCourseCard";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    price: 99.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Advanced Machine Learning",
    instructor: "Dr. Michael Chen",
    price: 149.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Digital Marketing Masterclass",
    instructor: "Emma Davis",
    price: 79.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=2074&auto=format&fit=crop",
  },
];

const MyCourses = () => {
  const navigate= useNavigate();
  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <MyCourseCourseCard
              onClick={() => {navigate("/Course/"+course.id)}}
              key={course.id}
              {...course}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default MyCourses;