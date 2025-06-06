package com.edtech.edtch.models;

import java.util.UUID;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Table(name="Topics")
public class Topics {
    @Id
    private int TopicId = UUID.randomUUID().hashCode();
    private String TopicName;

    @ManyToOne
    private Courses course; 
}
