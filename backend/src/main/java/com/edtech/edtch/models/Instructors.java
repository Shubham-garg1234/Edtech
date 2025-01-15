package com.edtech.edtch.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
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
@Table(name="Instructor")
public class Instructors {
    @Id
    private int InstructorId; 
    private String Qualifications;
    private int Experience;

    @OneToOne
    private Users user; 
}
