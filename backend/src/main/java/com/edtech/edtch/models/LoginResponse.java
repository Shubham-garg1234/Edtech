package com.edtech.edtch.models;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class LoginResponse {
    private int userId;
    private String userName;
    private int numberOfItemInCart;
    private List<Integer> purchasedCourse;
}
