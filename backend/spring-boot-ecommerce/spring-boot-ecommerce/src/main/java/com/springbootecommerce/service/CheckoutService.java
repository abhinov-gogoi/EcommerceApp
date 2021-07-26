package com.springbootecommerce.service;

import com.springbootecommerce.dto.Purchase;
import com.springbootecommerce.dto.PurchaseResponse;


public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
