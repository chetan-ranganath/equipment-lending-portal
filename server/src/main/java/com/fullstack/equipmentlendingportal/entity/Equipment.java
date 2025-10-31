package com.fullstack.equipmentlendingportal.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "equipment")
@Getter
@Setter
public class Equipment {

    private String equipmentId;
    private String name;
    private EquipmentCategory category;
    private String description;
    private int totalQuantity;
    private int availableQuantity;
    private EquipmentCondition condition;
    private boolean isAvailable;
    private String imageUrl;

}
