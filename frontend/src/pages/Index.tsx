import { Header } from "@/components/Header";
import { Carousel } from "@/components/Carousel";
import { CourseGrid } from "@/components/CourseGrid";

const Index = () => {
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