package com.fullstack.equipmentlendingportal.repository;

import com.fullstack.equipmentlendingportal.entity.Equipment;
import com.fullstack.equipmentlendingportal.entity.EquipmentCategory;

import java.util.List;

public interface EquipmentRepository {

    List<Equipment> findAllEquipments();

    Equipment findEquipmentById(String equipmentId);

    List<Equipment> findByCategory(EquipmentCategory category);

    List<Equipment> findByAvailability(boolean available);

    List<Equipment> findByCategoryAndAvailability(EquipmentCategory category, boolean available);

    Equipment findByEquipmentId(String id);


}
