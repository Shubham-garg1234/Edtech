package com.edtech.edtch.models;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name="UserEnrollments")
public class UserEnrollments {
    
    @Id
    private int EnrollmentId=UUID.randomUUID().hashCode();

    @ManyToOne
    private Users user;

    @ManyToOne
    private Courses course;
}