import { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: { userId: string | null; userName: string | null };
  setUser: (user: { userId: string | null; userName: string | null }) => void;
  numberOfItemInCart: number; 
  setNumberOfItemInCart: (count: number) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState({ userId: "0", userName: null });
  const [numberOfItemInCart, setNumberOfItemInCart] = useState(0);

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
