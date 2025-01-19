package com.edtech.edtch.models;

import lombok.Data;
import java.util.List;

@Data
public class PurchaseRequest {
    private int userId;
    private List<Integer> courseIds;
}
