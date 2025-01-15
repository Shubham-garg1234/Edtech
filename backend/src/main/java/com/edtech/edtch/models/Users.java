package com.edtech.edtch.models;

import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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

@Table(name="Users")
public class Users {
    @Id
    private int UserId = UUID.randomUUID().hashCode();
    private String UserName;
    private String Email;
    private String Password;
}
