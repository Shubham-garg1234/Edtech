import { useState } from "react";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

// Sample course data - in a real app this would come from an API
// const initialCourses = [
//   {
//     id: 1,
//     title: "React Masterclass 2024",
//     price: 99.99,
//     image: "https://placehold.co/400x300/9b87f5/ffffff?text=React+Course",
//   },
//   {
//     id: 2,
//     title: "TypeScript Advanced Concepts",
//     price: 79.99,
//     image: "https://placehold.co/400x300/7E69AB/ffffff?text=TypeScript+Course",
//   },
//   {
//     id: 3,
//     title: "Web Development Bootcamp",
//     price: 149.99,
//     image: "https://placehold.co/400x300/9b87f5/ffffff?text=Web+Dev+Course",
//   },
// ];

const initialCourses=[];

const Index = () => {
  const [cartItems, setCartItems] = useState(initialCourses);

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
    // Here you would typically redirect to a checkout page
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="text-primary" size={32} />
          <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        </div>

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

export default Index;