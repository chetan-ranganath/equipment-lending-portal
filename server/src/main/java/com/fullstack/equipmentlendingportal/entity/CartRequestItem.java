package com.fullstack.equipmentlendingportal.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRequestItem {
    private Equipment equipment;
    private int requestedQuantity;
}
