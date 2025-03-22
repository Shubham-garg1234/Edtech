import { Star } from "lucide-react";
import { Card } from "./ui/card";

interface CourseCardProps {
  title: string;
  instructor: string;
  price: number;
  rating: number;
  image: string;
  onClick?: () => void;
}

export const CourseCard = ({
  title,
  instructor,
  price,
  rating,
  image,
  onClick,
}: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg" onClick={onClick}>
      
      <a href="#" className="block">
        <img
          src={image}
          alt={title}
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{instructor}</p>
          <div className="flex items-center mt-2">
            <span className="text-amber-400 flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating ? "fill-current" : "fill-none"
                  }`}
                />
              ))}
            </span>
            <span className="ml-2 text-sm text-gray-600">{4.8}</span>
          </div>
          <div className="mt-3 font-bold text-lg">${price.toFixed(2)}</div>
        </div>
      </a>
    </Card>
  );
};