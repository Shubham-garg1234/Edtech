interface Lesson {
    id: number;
    title: string;
    type: "video" | "test";
    duration: string;
    completed?: boolean;
  }
  
  interface LessonListProps {
    lessons: Lesson[];
    selectedLesson: number;
    onSelectLesson: (index: number) => void;
  }
  
  export const LessonList = ({ lessons, selectedLesson, onSelectLesson }: LessonListProps) => {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Course Content</h2>
        <div className="space-y-2">
          {lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedLesson === index
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
                  lesson.completed ? "bg-green-500 text-white" : "bg-gray-200"
                } text-sm mr-3`}>
                  {lesson.completed ? "✓" : index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="font-medium">{lesson.title}</h3>
                  <p className="text-sm text-gray-500">
                    {lesson.type === "test" ? "📝 Test" : "🎥 Video"} • {lesson.duration}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };