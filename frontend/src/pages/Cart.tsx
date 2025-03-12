import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCourses } from "@/contexts/CourseContext";
import usePaymentService from "../components/PaymentService"


const Cart = () => {
const navigate = useNavigate();
const [cartItems, setCartItems] = useState([]);  
const { user } = useAuth();
const {cart,setCart,removeItemFromCart, numberOfItemsInCart, setNumberOfItemsInCart, clearCart } = useCart();
const { addCourse } = useCourses();
const { handlePayment } = usePaymentService();
const total = cartItems.reduce((sum, item) => sum + item.price, 0);
const [paymentResponse, setPaymentResponse] = useState(null);

useEffect(()=>{
  if(!(user.userName)){
     navigate('/');
     toast("You need to log in to see your cart.")
  }
  else{
    setCartItems(cart);
  }
},[])

  useEffect(()=>{
    const AfterPayement = async () =>{
      if (!paymentResponse) return;
      let courseIds = cartItems.map((item) => item.courseid);
      if (paymentResponse.ok) {
        const response = await fetch("http://localhost:8081/api/purchaseCourses", {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json"  ,
          },
          body: JSON.stringify(courseIds),
        });
        if(response.ok){
          cartItems.map((item) => addCourse(
            {
              courseId: item.courseid,
              courseName: item.courseName,
              instructorName: "Still remining",
              courseImageURL: item.courseImageURL
            }
          ));
          setCartItems([]);
          clearCart();
          toast("Transaction successfull ")
        }else{
          alert("Your Payment is success but error on our side Please contact support team");
        }
      } else {
        console.error("Failed to buy courses:", paymentResponse.statusText);
      }
    }
    AfterPayement();
  },[paymentResponse])

  const handleCheckout = async () => {
    try {
      const response=(await handlePayment(total));
      setPaymentResponse(response);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  }

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.courseid !== id));
    deleteItemFromCart(id);
    removeItemFromCart(id);
    setCart(cartItems);
  };

  async function deleteItemFromCart(courseId) {

    try {
      const response = await fetch("http://localhost:8081/api/deleteItem", {
        method: "POST",
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseId),
      });
      if (response.ok) {
        setNumberOfItemsInCart(numberOfItemsInCart-1);
        removeItemFromCart(Number(courseId));
        toast.success("Item removed from cart");
      } else {
        const error = await response.json();
        console.error("Error:", error);
        return { success: false, message: error };
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      return { success: false, message: "Something went wrong." };
    }
  }  

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
                  key={item.courseid}
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