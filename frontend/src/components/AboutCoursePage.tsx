import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowLeft, Clock, BookOpen, FileText, GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { refreshToken } from '@/util/RefreshToken';
import { useCourses } from '@/contexts/CourseContext';


interface CourseCardProps {
  name: string;
  instructor: {instructorName
:string  };
  description: string;
  duration: string;
  lectures: number;
  availableSlots: number;
  tests: number;
  startDate: string;
  price: number;
  rating: number;
  imageUrl: string;
  bought: boolean;
  onAddToCart: () => void;
}


export const AboutCoursePage = ({
    name,
    instructor,
    description,
    duration,
    lectures,
    availableSlots,
    tests,
    startDate,
    price,
    rating,
    imageUrl,
    bought,
  }: CourseCardProps) => {
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const { user , setUser } = useAuth();
  const { setPurchasedCourses } = useCourses();
  const { addItemToCart, setNumberOfItemsInCart } = useCart();

  const { CourseId } = useParams();
  
  const courseData = {
    name: name,
    instructor: instructor,
    price: price,
    rating: rating,
    startDate: startDate,
    duration: duration,
    assignments: availableSlots,
    lectures: lectures,
    tests: tests,
    description: description,
    image: imageUrl
  };


  async function handleAddToCart() {
    try {
      if((user.userId)=='0'){ 
        toast({
          title: "Access Denied",
          description: "You need to login into your account", 
        });
        navigate('/');
      }
      else{
        const courseId=CourseId;
        const response = await fetch("http://localhost:8081/addItem", {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseId),
        });
    
        if (response.ok) {
          const additem={
            courseid: Number(CourseId),
            courseName: courseData.name,
            courseImageURL: courseData.image,
            price: courseData.price,
          };
          addItemToCart(additem)
          setIsInCart(true);
          toast({
            title: "Course Added to your cart",
          });
        } 
        else if (response.status === 403) {
          console.log("Token Expired")
          if(await refreshToken()){
            await handleAddToCart()
          }
          else{
            setUser({userId: null, userName: null});
            setNumberOfItemsInCart(0);
            setPurchasedCourses(null);
            navigate('/');
          }
        }
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      return { success: false, message: "Something went wrong." };
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2 hover:bg-gray-100"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <Card className="max-w-7xl mx-auto overflow-hidden bg-white">
        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img 
              src={courseData.image} 
              alt={courseData.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData.name}</h1>
              <p className="text-lg text-gray-600">by {courseData.instructor.instructorName}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(courseData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{courseData.rating}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-semibold">{courseData.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Lectures</p>
                  <p className="font-semibold">{courseData.lectures}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Assignments</p>
                  <p className="font-semibold">{courseData.assignments}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Tests</p>
                  <p className="font-semibold">{courseData.tests}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed">{courseData.description}</p>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className='text-3xl font-bold text-gray-900'>${courseData.price}</div>
              {!bought && (
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isInCart}
                  className={`${
                    isInCart
                      ? "bg-green-600 hover:bg-green-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors duration-200`}
                >
                  {isInCart ? "Added to Cart" : "Add to Cart"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};