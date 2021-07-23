package com.springbootecommerce.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.security.PrivateKey;

@Entity
@Table(name = "address")
@Getter
@Setter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;
}
