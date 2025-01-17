package com.edtech.edtch.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ModifyCartRequest {
    private Integer userId;
    private Integer courseId;
}
