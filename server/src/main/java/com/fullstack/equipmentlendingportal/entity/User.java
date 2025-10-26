package com.fullstack.equipmentlendingportal.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "User")
@Getter
@Setter
public class User {

    @Id
    String userId;
    @Indexed(unique = true)
    String username;
    String password;
    String role;
    String createdAt;

}
