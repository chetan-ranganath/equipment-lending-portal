package com.fullstack.equipmentlendingportal.service;

import com.fullstack.equipmentlendingportal.entity.Equipment;
import com.fullstack.equipmentlendingportal.entity.EquipmentCategory;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface EquipmentService {
    List<Equipment> findAllEquipments();

    ResponseEntity<?> findEquipmentById(String equipmentId);

    List<Equipment> findByCategory(EquipmentCategory category);

    List<Equipment> findByAvailability(boolean available);

    List<Equipment> findByCategoryAndAvailability(EquipmentCategory category, boolean available);

}
