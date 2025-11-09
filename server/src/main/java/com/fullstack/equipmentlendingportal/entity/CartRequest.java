package com.fullstack.equipmentlendingportal.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Document(collection = "cart_requests")
public class CartRequest {

    @MongoId
    private String id;

    private String username;
    private String status;
    private String purpose;
    private LocalDateTime requestedAt;
    private String returnDate;
    private List<CartRequestItem> items;
}

