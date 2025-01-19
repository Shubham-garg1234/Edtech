import React, { createContext, useContext, useState, ReactNode } from "react";

type Course = {
    courseid: number;
    courseName: string;
    courseImageURL: string;
    price: number;
};

type CartContextType = {
    cart: Course[]; // Full cart details
    numberOfItemsInCart: number;
    setNumberOfItemsInCart: (count: number) => void;
    setCart: (courses: Course[]) => void; // Set the entire cart
    addItemToCart: (course: Course) => void; // Add a single item
    removeItemFromCart: (courseid: number) => void; // Remove an item by ID
    clearCart: () => void; // Clear the entire cart
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCartState] = useState(null); 
    const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);

    const setCart = (courses: Course[]) => {
        setCartState(courses);
        setNumberOfItemsInCart(courses.length);
    };

    const addItemToCart = (course: Course) => {
        setCartState((prev) => {
            const exists = prev.some((item) => item.courseid === course.courseid);
            if (!exists) {
                return [...prev, course];
            }
            return prev;
        });
        setNumberOfItemsInCart((prev) => prev + 1);
    };

    const removeItemFromCart = (courseid: number) => {
        console.log(courseid);
        setCartState((prev) => {
            const updatedCart = prev.filter((item) => item.courseid !== courseid);
            setNumberOfItemsInCart(updatedCart.length); 
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCartState([]);
        setNumberOfItemsInCart(0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                numberOfItemsInCart,
                setNumberOfItemsInCart,
                setCart,
                addItemToCart,
                removeItemFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
