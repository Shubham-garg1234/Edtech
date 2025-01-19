import React, { createContext, useContext, useState, ReactNode } from "react";

type CourseContextType = {
    purchasedCourses: number[];
    setPurchasedCourses: (courses: number[])=>void;
    addCourse: (courseId: number) => void;
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
    const [purchasedCourses, setPurchasedCourses] = useState<number[]>([]);

    const addCourse = (courseId: number) => {
        if (!purchasedCourses.includes(courseId)) {
            setPurchasedCourses((prev) => [...prev, courseId]);
        }
    };

    return (
        <CourseContext.Provider value={{ purchasedCourses, setPurchasedCourses, addCourse }}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourses = () => {
    const context = useContext(CourseContext);
    if (!context) throw new Error("useCourses must be used within a CourseProvider");
    return context;
};
