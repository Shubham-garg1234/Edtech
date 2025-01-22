import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: { userId: string | null; userName: string | null };
  setUser: (user: { userId: string | null; userName: string | null }) => void;
  numberOfItemInCart: number; 
  setNumberOfItemInCart: (count: number) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [user, setUser] = useState<{ userId: string | null; userName: string | null }>(() => {
    const savedUser = sessionStorage.getItem("authUser");
    return savedUser ? JSON.parse(savedUser) : { userId: "0", userName: null };
  });
  
  const [numberOfItemInCart, setNumberOfItemInCart] = useState<number>(() => {
    const savedCartCount = sessionStorage.getItem("numberOfItemInCart");
    return savedCartCount ? JSON.parse(savedCartCount) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("authUser", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem("numberOfItemInCart", JSON.stringify(numberOfItemInCart));
  }, [numberOfItemInCart]);


  return (
    <AuthContext.Provider value={{ user, setUser, numberOfItemInCart, setNumberOfItemInCart }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
