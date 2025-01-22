import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Course = {
    courseid: number;
    courseName: string;
    courseImageURL: string;
    price: number;
};

type CartContextType = {
    cart: Course[]; 
    numberOfItemsInCart: number;
    isloaded: boolean;
    setloaded: () => void;
    setNumberOfItemsInCart: (count: number) => void;
    setCart: (courses: Course[]) => void; // Set the entire cart
    addItemToCart: (course: Course) => void; // Add a single item
    removeItemFromCart: (courseid: number) => void; // Remove an item by ID
    clearCart: () => void; // Clear the entire cart
    alreadyAdded: (courseid:number) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    
    const [cart, setCartState] = useState<Course[]>(() => {
        const savedCart = sessionStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [numberOfItemsInCart, setNumberOfItemsInCart] = useState<number>(() => {
        const savedCount = sessionStorage.getItem("numberOfItemsInCart");
        return savedCount ? JSON.parse(savedCount) : 0;
    });

    const [isloaded, setisloaded] = useState<boolean>(() => {
        const savedLoaded = sessionStorage.getItem("isloaded");
        return savedLoaded ? JSON.parse(savedLoaded) : false;
    });

    useEffect(() => {
        sessionStorage.setItem("cart", JSON.stringify(cart));
        sessionStorage.setItem("numberOfItemsInCart", JSON.stringify(numberOfItemsInCart));
        sessionStorage.setItem("isloaded", JSON.stringify(isloaded));
    }, [cart, numberOfItemsInCart, isloaded]);


    const setloaded = () =>{
        setisloaded(true);
    }
    
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

    const alreadyAdded = (courseid: number) =>{
        let result=false;
        for(let i=0;i<cart.length;i++){
            if(cart[i].courseid==courseid) return true;
        }
        return false;
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                numberOfItemsInCart,
                isloaded,
                setloaded,
                setNumberOfItemsInCart,
                setCart,
                addItemToCart,
                removeItemFromCart,
                clearCart,
                alreadyAdded
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
