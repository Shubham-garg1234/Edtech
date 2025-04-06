package com.edtech.edtch.models;

import java.util.UUID;

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

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "Lectures")
public class Lectures {
    @Id
    private int LectureId;
    private String key;
    private String Title;
    private String Description;
    private String Duration;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Courses course;
}
