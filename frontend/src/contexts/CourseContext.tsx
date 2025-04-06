import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Course = {
    courseId: number;
    courseName: string;
    instructorName: string;
    courseImageURL: string;
};

type InstructorCourse = {
    id: number;
    title: string;
    description: string;
    image: string;
    students: number;
    lectures: number;
};

type CourseContextType = {
    purchasedCourses: number[];
    setPurchasedCourses: (courses: number[]) => void;
    myCourses: Course[];
    setMyCourses: (courses: Course[]) => void;
    addCourse: (course: Course) => void;
    InstructorCourses: InstructorCourse[];
    setInstructorCourses: (courses: InstructorCourse[]) => void;
    addInstructorCourse: (course: InstructorCourse) => void;
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
    const [purchasedCourses, setPurchasedCourses] = useState<number[]>(() => {
        const savedCourses = sessionStorage.getItem("purchasedCourses");
        return savedCourses ? JSON.parse(savedCourses) : [];
    });

    const [myCourses, setMyCourses] = useState<Course[]>(() => {
        const savedMyCourses = sessionStorage.getItem("myCourses");
        return savedMyCourses ? JSON.parse(savedMyCourses) : [];
    });

    const [InstructorCourses, setInstructorCourses] = useState<InstructorCourse[]>(() => {
        const savedInstructorCourses = sessionStorage.getItem("InstructorCourses");
        return savedInstructorCourses ? JSON.parse(savedInstructorCourses) : [];
    });

    useEffect(() => {
        sessionStorage.setItem("purchasedCourses", JSON.stringify(purchasedCourses));
    }, [purchasedCourses]);

    useEffect(() => {
        sessionStorage.setItem("myCourses", JSON.stringify(myCourses));
    }, [myCourses]);

    useEffect(() => {
        sessionStorage.setItem("InstructorCourses", JSON.stringify(InstructorCourses));
    }, [InstructorCourses]);

    const addCourse = (course: Course) => {
        if (!purchasedCourses.includes(course.courseId)) {
            setPurchasedCourses((prev) => [...prev, course.courseId]);
            setMyCourses((prev) => [...prev, course]);
        }
    };

    const addInstructorCourse = (course: InstructorCourse) => {
        if (!InstructorCourses.some(c => c.id === course.id)) {
            setInstructorCourses(prev => [...prev, course]);
        }
    };

    return (
        <CourseContext.Provider
            value={{
                purchasedCourses,
                setPurchasedCourses,
                myCourses,
                setMyCourses,
                addCourse,
                InstructorCourses,
                setInstructorCourses,
                addInstructorCourse,
            }}
        >
            {children}
        </CourseContext.Provider>
    );
};

export const useCourses = () => {
    const context = useContext(CourseContext);
    if (!context) throw new Error("useCourses must be used within a CourseProvider");
    return context;
};
