import { Star } from "lucide-react";
import { Card } from "./ui/card";

interface CourseCardProps {
  courseName: string;
  instructorName: string;
  courseImageURL: string;
  onClick?: () => void;
}

export const MyCourseCourseCard = ({
  courseName,
  instructorName,
  courseImageURL,
  onClick,
}: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg" onClick={onClick}>
      
      <a href="#" className="block">
        <img
          src={courseImageURL}
          alt={courseName}
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2">{courseName}</h3>
          <p className="text-sm text-gray-500 mt-1">{instructorName}</p>
        </div>
      </a>
    </Card>
  );
};