import { Header } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { CourseGrid } from "@/components/CourseGrid";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCourses } from "@/contexts/CourseContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { refreshToken } from "@/util/RefreshToken";

const Index = () => {
  const { setUser } = useAuth();
  const { setNumberOfItemsInCart } = useCart();
  const { setPurchasedCourses } = useCourses();
  const navigate = useNavigate();

  const getUserDetails = async() => {
    try{
      const response = await fetch("http://localhost:8081/getUserDetails", {
          method: "GET",
          credentials: 'include',
          headers: {
              "Content-Type": "application/json",
          },
      });

      if(response.ok){
        const res2=await response.json();
        setUser({ userName: res2.userName,  });
        setNumberOfItemsInCart(res2.numberOfItemInCart);
        setPurchasedCourses(res2.purchasedCourse);
        navigate('/');
      }
      else if (response.status === 403) {
        console.log("Token Expired")
        if(await refreshToken()){
          await getUserDetails()
        }
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  useEffect(() => {
      getUserDetails()
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Carousel />
        <CourseGrid />
      </main>
    </div>
  );
};

export default Index;