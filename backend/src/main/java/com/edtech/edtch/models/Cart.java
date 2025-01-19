package com.edtech.edtch.models;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
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

public class Cart {

        @Id
        private int CartId = UUID.randomUUID().hashCode();

        @ManyToOne
        private Users user;

        @ManyToOne
        private Courses course;
}
