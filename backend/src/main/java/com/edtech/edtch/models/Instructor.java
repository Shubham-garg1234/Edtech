package com.edtech.edtch.models;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
public class Instructor {
    @Id
    private UUID InstructorId; // Same as UserId
    private String Qualifications;
    private int Experience;

    @OneToOne
    private User user; // Maps the instructor to the user
}
