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

  const { user } = useAuth();
  const { isloaded, setCart, setloaded } = useCart();
  const { setMyCourses ,setInstructorCourses} = useCourses();

  useEffect(() => {
    if (!user?.userName) {
      getUserDetails();
    }
  }, []); 

  useEffect(()=>{
    if((user.userName!=null) && isloaded==false){getMyCourses(), getCartItems(), getInstructorCourses()}; 

      async function getCartItems(){
        try {
          const response = await fetch("http://localhost:8081/api/getCartItems", {
              method: "GET",
              credentials: 'include',
              headers: {
                  "Content-Type": "application/json",
              },
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
          const response = await fetch("http://localhost:8081/api/getMyCourses", {
              method: "POST",
              credentials: 'include',
              headers: {
                  "Content-Type": "application/json",
              },
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



      async function getInstructorCourses(){
        try {
          const response = await fetch("http://localhost:8081/api/getInstructorCourses", {
              method: "POST",
              credentials: 'include',
              headers: {
                  "Content-Type": "application/json",
              },
          });
          const data = await response.json();
          const newInstructorCourses=[];

          for(let i=0;i<data.length;i++){
            newInstructorCourses.push({
              id: data[i].id,
              title: data[i].title,
              description: data[i].description,
              image: data[i].image || "https://tse2.mm.bing.net/th?id=OIP.JYDLll34aYDNbDUk2j81ZQHaEO&pid=Api&P=0&h=220",
              students: data[i].students,
              lectures: data[i].lectures,
            });
          }
          setInstructorCourses(newInstructorCourses);
        } catch (error) {
          setInstructorCourses([]);
            console.error("Error during fetch:", error);
        }
      }

  },[user])

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
        setUser({ userName: res2.userName });
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