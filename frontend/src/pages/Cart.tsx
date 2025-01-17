import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/AuthContext";


const Cart = () => {
const navigate = useNavigate();
const newCartItems=[];
const [cartItems, setCartItems] = useState([]);  
const { user ,numberOfItemInCart, setNumberOfItemInCart } = useAuth();

useEffect(()=>{
  if(!(user.userId)) navigate('/');
  else{
    getCartItems();
  }
},[])

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    deleteItemFromCart(user.userId,id);
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
  };

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
      for(let i=0;i<data.length;i++){
        newCartItems.push({
          id: data[i].courseid,
          title: data[i].courseName,
          price: data[i].price,
          image: data[i].courseImageURL,
        });
      }
      setCartItems(newCartItems);

  } catch (error) {
      console.error("Error during fetch:", error);
  }
  }


  async function deleteItemFromCart(userId, courseId) {
    try {
      const response = await fetch("http://localhost:8081/api/v1/deleteItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, courseId }),
      });
  
      if (response.ok) {
        setNumberOfItemInCart(numberOfItemInCart-1);
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