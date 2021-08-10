package com.springbootecommerce.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("")
public class HelloController {

    @RequestMapping("")
    public String working() {
        return "Hello from Abhinov !!!" ;
    }
}
