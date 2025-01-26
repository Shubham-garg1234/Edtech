import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCourses } from "@/contexts/CourseContext";
import { refreshToken } from "@/util/RefreshToken";

const Cart = () => {
  const navigate = useNavigate();
  const newCartItems=[];
  const [cartItems, setCartItems] = useState([]);  
  const { user , setUser } = useAuth();
  const { setPurchasedCourses } = useCourses();
  const {cart,setCart,removeItemFromCart, numberOfItemsInCart, setNumberOfItemsInCart, clearCart } = useCart();
  const { addCourse } = useCourses();

  useEffect(()=>{
    if((user.userId)=='0'){
      navigate('/');
      toast("You need to log in to see your cart.")
    }
    else{
      if(!cart)
      getCartItems();
      else{
      setCartItems(cart);
      for(let i=0;i<cart.length;i++){
        newCartItems.push({
          id: cart[i].courseid,
          title: cart[i].courseName,
          price: cart[i].price,
          image: cart[i].courseImageURL,
        });
      }
      setCartItems(newCartItems);
      }
    }
  },[])

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    deleteItemFromCart(id);
    removeItemFromCart(id);
  };

  const handleCheckout = async () => {
    try {
      let courseIds = [];
      cartItems.map((item) => (
        courseIds.push(item.id)
      ));
      const response = await fetch("http://localhost:8081/purchaseCourses", {
          method: "POST",
          credentials: "include",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(courseIds)
      });

      if(response.ok){
        for(let i=0;i<cart.length;i++){
          addCourse(cart[i].courseid);
        }
        setCartItems([])
        clearCart();
        toast.success("Checkout Successful!!");
      }
      else if (response.status === 403) {
        console.log("Token Expired")
        if(await refreshToken()){
          await handleCheckout()
        }
        else{
          setUser({userId: null, userName: null});
          setNumberOfItemsInCart(0);
          setPurchasedCourses(null);
          toast.error("You need to login into your account")
          navigate('/');
        }
      }
    } catch (error) {
        console.error("Error during purchasing course:", error);
    }
  };

  async function getCartItems(){
    try {
      const response = await fetch("http://localhost:8081/getCartItems", {
          method: "GET",
          credentials: "include",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if(response.ok){
        const data = await response.json();
        setCart(data);

        for(let i=0;i<data.length;i++){
          newCartItems.push({
            id: data[i].courseid,
            title: data[i].courseName,
            price: data[i].price,
            image: data[i].courseImageURL,
          });
        }
        setCartItems(newCartItems);
      }
      else if (response.status === 403) {
        console.log("Token Expired")
        if(await refreshToken()){
          await getCartItems()
        }
        else{
          setUser({userId: null, userName: null});
          setNumberOfItemsInCart(0);
          setPurchasedCourses(null);
          navigate('/');
        }
      }
    } catch (error) {
        console.error("Error during fetch:", error);
    }
  }

  async function deleteItemFromCart(courseId: number) {
    try {
      const response = await fetch("http://localhost:8081/deleteItem", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseId),
      });
  
      if (response.ok) {
        setNumberOfItemsInCart(numberOfItemsInCart-1);
        toast.success("Item removed from cart");
      } 
      else if (response.status === 403) {
        console.log("Token Expired")
        if(await refreshToken()){
          await deleteItemFromCart(courseId)
        }
        else{
          setUser({userId: null, userName: null});
          setNumberOfItemsInCart(0);
          setPurchasedCourses(null);
          toast.error("You need to login into your account")
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      return { success: false, message: "Something went wrong." };
    }
  }  

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="text-primary" size={32} />
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 flex items-center hover:text-gray-900"
        >
          <span className="mr-1">←</span> Back
        </button>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600">Your cart is empty</h2>
            <p className="text-gray-500 mt-2">Add some courses to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
            <div className="lg:col-span-1">
              <CartSummary total={total} onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;