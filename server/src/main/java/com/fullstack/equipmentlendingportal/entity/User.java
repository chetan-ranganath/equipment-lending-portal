package com.fullstack.equipmentlendingportal.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "User")
@Getter
@Setter
public class User {

    @MongoId
    String userId;
    @Indexed(unique = true)
    String username;
    String password;
    String role;
    String createdAt;

}
