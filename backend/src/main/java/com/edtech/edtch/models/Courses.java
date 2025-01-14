package com.edtech.edtch.models;

import java.sql.Date;
import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
public class Courses {
    @Id
    private UUID CourseId = UUID.randomUUID();
    private String CourseName;
    private String Description;
    private Date StartDate;
    private String Duration;
    private double Price;
    private int Slots;
    private int Lectures;
    private int Tests;
    private int Assignments;

    @ManyToOne
    private Instructor instructor; // Reference to the Instructor
}
