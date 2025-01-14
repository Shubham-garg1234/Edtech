package com.edtech.edtch.models;

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
public class Topics {
    @Id
    private UUID TopicId = UUID.randomUUID();
    private String TopicName;

    @ManyToOne
    private Courses course; 
}
