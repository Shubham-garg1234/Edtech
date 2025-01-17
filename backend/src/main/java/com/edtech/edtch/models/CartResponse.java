package com.edtech.edtch.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class CartResponse {
    private int Courseid;
    private String CourseName;
    private double Price;
    private String CourseImageURL;
}
