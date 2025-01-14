package com.edtech.edtch;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Testing {
    @RequestMapping("/")
    public String Greet(){
        return "Greeting";
    }
}