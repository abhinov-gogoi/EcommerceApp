package com.springbootecommerce.controller;


import com.springbootecommerce.dto.Purchase;
import com.springbootecommerce.dto.PurchaseResponse;
import com.springbootecommerce.service.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @GetMapping("")
    public String working() {
        return "Hello from Abhinov, order purchase get request works !!!" ;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {

        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }

}









