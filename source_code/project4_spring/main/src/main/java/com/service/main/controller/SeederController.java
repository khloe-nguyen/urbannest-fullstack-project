package com.service.main.controller;

import com.service.main.service.seeder_service.UserSeeder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("seeder")
public class SeederController {

    @Autowired
    private UserSeeder userSeeder;

    @PostMapping("seed_user")
    public void seedUser(){
        userSeeder.seedUsers(300);
    }


    @PostMapping("seed_property")
    public void seedProperty(){
        userSeeder.seedTphcmProperties();
    }

    @PostMapping("seed_booking")
    public void seedBooking(){
        userSeeder.seedBooking();
    }
}
