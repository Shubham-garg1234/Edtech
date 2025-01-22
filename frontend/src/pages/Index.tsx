import { Header } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { CourseGrid } from "@/components/CourseGrid";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";
import { useCourses } from "@/contexts/CourseContext";

const Index = () => {

  const { user } = useAuth();
  const { isloaded, setCart, setloaded } = useCart();
  const { setMyCourses } = useCourses();

  useEffect(()=>{
    if(user.userId!='0' && isloaded==false){getCartItems(), getMyCourses()}; 

      async function getCartItems(){
        try {
          const response = await fetch("http://localhost:8081/api/v1/getCartItems", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(user)
          });
    
          const data = await response.json();
          const newCartItems=[];
    
          for(let i=0;i<data.length;i++){
            newCartItems.push({
              courseid: data[i].courseid,
              courseName: data[i].courseName,
              price: data[i].price,
              courseImageURL: data[i].courseImageURL,
            });
          }

          setCart(newCartItems);
        } catch (error) {
            console.error("Error during fetch:", error);
        }
      }

      async function getMyCourses(){
        try {
          const response = await fetch("http://localhost:8081/api/v1/getMyCourses", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(user)
          });
    
          const data = await response.json();
          const myCourses=[];
    
          for(let i=0;i<data.length;i++){
            myCourses.push({
              courseId: data[i].courseId,
              courseName: data[i].courseName,
              instructorName: data[i].instructorName,
              courseImageURL: data[i].courseImageURL,
            });
          }
          setMyCourses(myCourses);
    
        } catch (error) {
            console.error("Error during fetch:", error);
        }
      }

  },[user])

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