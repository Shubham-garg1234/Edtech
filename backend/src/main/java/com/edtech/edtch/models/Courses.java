package com.edtech.edtch.models;

import java.sql.Date;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "Courses")
public class Courses {
    @Id
    private int CourseId=UUID.randomUUID().hashCode();
    private String CourseName;
    private String Description;
    private Date StartDate;
    private String Duration;
    private double Price;
    private int Slots;
    private int Lectures;
    private int Tests;
    private int Assignments;
    private String CourseImageURL;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "instructor_id")
    private Instructors instructor;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "stream_id")
    private Streams stream;
}
