import { CourseCard } from "./CourseCard";

const courses = [
  {
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    price: 89.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
  {
    title: "Machine Learning A-Z: Hands-On Python & R",
    instructor: "Kirill Eremenko",
    price: 129.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
  },
  {
    title: "iOS App Development with Swift",
    instructor: "Robert Petras",
    price: 99.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
];

export const CourseGrid = () => {
  return (
    <div className="container py-12">
      <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <CourseCard key={index} {...course} />
        ))}
      </div>
    </div>
  );
};