package com.edtech.edtch.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignalingMessage {
    private String type;
    private String sdp;
    private String candidate;
    private String userId;
}
