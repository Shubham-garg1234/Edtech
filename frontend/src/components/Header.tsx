import { Search, ShoppingCart, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";

export const Header = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const[searchWord,setSearchWord]=useState("");
  const { user } = useAuth();
  const { numberOfItemsInCart, setNumberOfItemsInCart } = useCart();

  async function handleSearch(str) {
    try {
        setSearchWord(str);
        if(str==""){
          setSearchResults([]);
          return;
        }
        const response = await fetch("http://localhost:8081/api/v1/getLike", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: str,
        });

        const data = await response.json();
        setSearchResults(data);

    } catch (error) {
        console.error("Error during fetch:", error);
    }
}

const handleCartClick = () => {
    if (user.userId=='0') {
      toast({
        title: "Please login first",
        description: "You need to log in to see your cart.",
      });
    } else {
      navigate("/cart");
    }
  };



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between space-x-4">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">EduXcel</span>
          </a>
          <div className="hidden md:flex relative w-96">
            <Input
              type="search"
              placeholder="Search courses..."
              className="w-full pl-10"
              onChange={(e)=>{handleSearch(e.target.value)}}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />

            {searchWord!="" && searchResults.length > 0 && (
              <div className="absolute left-0 w-full mt-11 max-h-60 overflow-y-auto bg-white shadow-lg border rounded-lg z-10">
                <ul className="space-y-2">
                  {searchResults.map((course, index) => (
                    <li key={index} className="border-b py-2 px-4 cursor-pointer hover:bg-gray-100" onClick={()=>navigate(`/course/${course.courseId}`)}>
                      <a
                        className="text-primary hover:underline"
                      >
                        {course.courseName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <span className="hidden md:block text-sm font-medium cursor-pointer" onClick={()=>navigate("/myCourses")}>
            My Courses
          </span>
          <span className="hidden md:block text-sm font-medium cursor-pointer" onClick={()=>navigate("/manageCourses")}>
            Manage Courses
          </span>
          <Button variant="ghost" size="icon" className="relative" onClick={() => handleCartClick()}>
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-xs text-white flex items-center justify-center">
              {numberOfItemsInCart}
            </span>
          </Button>
          {user.userName ? (
            <>
            <span className="text-sm font-medium">Hi, {user.userName}!</span>
          </>
          ) :(
            <>
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button onClick={() => navigate("/signup")}>Sign up</Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => navigate("/login")}
          >
            <User className="h-5 w-5" />
          </Button>
          </>)
        }
        </nav>
      </div>
    </header>
  );
};