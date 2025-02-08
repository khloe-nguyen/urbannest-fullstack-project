package com.service.main.service;

import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FirebaseRealTimeService {

    @Autowired
    private DatabaseReference databaseReference;

    public void writeData(String key, Object value) {
        databaseReference.child(key).setValueAsync(value);
    }
}
