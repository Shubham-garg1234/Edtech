package com.edtech.edtch.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table (name="streams")
public class Streams {
    @Id
    private int streamId;
    private String streamUrl;
}
