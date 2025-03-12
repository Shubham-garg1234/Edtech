import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { uploadImageAndGetUrl } from "@/util/ImageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { refreshToken } from "@/util/RefreshToken";
import { useCart } from "@/contexts/CartContext";
import { useCourses } from "@/contexts/CourseContext";

const Teach = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [courseImageURL, setcourseImageURL] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { setUser } = useAuth();
  const { setNumberOfItemsInCart } = useCart();
  const { setPurchasedCourses } = useCourses();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    courseName: "",
    price: "",
    slots: "",
    description: "",
    instructorName: "",
    qualifications: "",
    experience: "",
    duration: "",
    topics: [""],
    numTests: "",
    numLectures: "",
    numAssignments: "",
  });

  useEffect(()=>{
      if((user.userId)=='0'){
         navigate('/');
         toast("You need to log in to add a course.")
      }
    },[])

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData({ ...formData, topics: newTopics });
  };

  const addTopic = () => {
    setFormData({ ...formData, topics: [...formData.topics, ""] });
  };

  const removeTopic = (index: number) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: newTopics });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = Number(formData.price);
    if (price < 200 || price > 100000) {
      toast.error("Price must be between ₹200 and ₹1,00,000");
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the platform charges");
      return;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ImageURL=await uploadImageAndGetUrl(file);
      setcourseImageURL(ImageURL);
    }
  };

  const registerCourse = async () => {
    const course = {
      courseName: formData.courseName,
      price: formData.price,
      slots: formData.slots,
      description: formData.description,
      instructor: {
        instructorName: formData.instructorName,
        qualifications: formData.qualifications,
        experience: formData.experience,
      },
      duration: formData.duration,
      tests: formData.numTests,
      lectures: formData.numLectures,
      assignments: formData.numAssignments,
      startDate: startDate,
      courseImageURL: courseImageURL,
    };

    try {
      const response = await fetch("http://localhost:8081/registerCourse", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
  
      if (response.ok) {
        toast.success("Course registered successfully!");
      }
      else if (response.status === 403) {
        console.log("Token Expired")
        if(await refreshToken()){
          await registerCourse()
        }
        else{
          setUser({userName: null});
          setNumberOfItemsInCart(0);
          setPurchasedCourses(null);
          toast.error("You need to login into your account")
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Error registering course:", error);
    }
  };
  
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <button
    onClick={() => navigate('/manageCourses')}
    className="mb-6 text-gray-600 flex items-center hover:text-gray-900 absolute top-7 left-10"
  >
    <span className="mr-1">←</span> Back
  </button>
      <div className="max-w-4xl mx-auto">
        <Card className="animate-in">
          
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
              Register Your Course 
            </CardTitle>
            <CardDescription>
              Fill in the details below to register your new course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  name="courseName"
                  placeholder="Enter course name"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Expected Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    placeholder="e.g., 3 months"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="Enter price in ₹"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="200"
                    max="100000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slots">Number of slots</Label>
                  <Input
                    id="slots"
                    name="slots"
                    type="number"
                    placeholder="Enter number of slots"
                    value={formData.slots}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numLectures">Number of Lectures</Label>
                  <Input
                    id="numLectures"
                    name="numLectures"
                    type="number"
                    placeholder="Enter number of lectures"
                    value={formData.numLectures}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numTests">Number of Tests</Label>
                  <Input
                    id="numTests"
                    name="numTests"
                    type="number"
                    placeholder="Enter number of tests"
                    value={formData.numTests}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numAssignments">Number of Assignments</Label>
                  <Input
                    id="numAssignments"
                    name="numAssignments"
                    type="number"
                    placeholder="Enter number of assignments"
                    value={formData.numAssignments}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructorName">Instructor Name</Label>
                <Input
                  id="instructorName"
                  name="instructorName"
                  placeholder="Enter instructor name"
                  value={formData.instructorName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input
                    id="qualifications"
                    name="qualifications"
                    placeholder="Enter qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    placeholder="Enter years of experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Topics Covered</Label>
                {formData.topics.map((topic, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder={`Topic ${index + 1}`}
                      value={topic}
                      onChange={(e) => handleTopicChange(index, e.target.value)}
                      required
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeTopic(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTopic}
                  className="mt-2"
                >
                  Add Topic
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter course description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[150px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Course Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {courseImageURL && (
                  <img
                    src={courseImageURL}
                    alt="Course preview"
                    className="mt-2 max-h-40 rounded-md"
                  />
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree that the platform will charge 10% on every enrollment
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white transition-all duration-200"
                onClick={registerCourse}
              >
                Register Course
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Teach;