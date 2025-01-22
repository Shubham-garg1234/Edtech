package com.edtech.edtch.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class MyCourseResponse {
    private int courseId;
    private String courseName;
    private String instructorName;
    private String courseImageURL;
}
