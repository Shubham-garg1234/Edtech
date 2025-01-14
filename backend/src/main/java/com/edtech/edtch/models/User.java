package com.edtech.edtch.models;

import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
public class User {
    @Id
    private UUID UserId = UUID.randomUUID();
    private String UserName;
    private String Email;
    private String Password;
}
