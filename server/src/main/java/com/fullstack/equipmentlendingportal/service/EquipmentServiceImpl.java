package com.fullstack.equipmentlendingportal.service;

import com.fullstack.equipmentlendingportal.config.AppConstants;
import com.fullstack.equipmentlendingportal.entity.Equipment;
import com.fullstack.equipmentlendingportal.entity.EquipmentCategory;
import com.fullstack.equipmentlendingportal.repository.EquipmentRepository;
import com.fullstack.equipmentlendingportal.util.HandleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentServiceImpl implements EquipmentService{
    @Autowired
    EquipmentRepository equipmentRepository;

    @Autowired
    AppConstants appConstants;

    @Autowired
    HandleResponse handleResponse;

    @Override
    public List<Equipment> findAllEquipments() {
        return equipmentRepository.findAllEquipments();
    }

    @Override
    public ResponseEntity<?> findEquipmentById(String equipmentId) {
      Equipment response = equipmentRepository.findEquipmentById(equipmentId);
      if (response==null){
          return handleResponse.onError(appConstants.getErrorCodes().getEquipmentNotFoundCode(),
                  appConstants.getErrorCodes().getEquipmentNotFoundMessage());
      }
      else{
          return ResponseEntity.ok(response);
      }
    }

    @Override
    public List<Equipment> findByCategory(EquipmentCategory category) {
        return equipmentRepository.findByCategory(category);
    }

    @Override
    public List<Equipment> findByAvailability(boolean isAvailable) {
        return equipmentRepository.findByAvailability(isAvailable);
    }

    @Override
    public List<Equipment> findByCategoryAndAvailability(EquipmentCategory category, boolean isAvailable) {
        return equipmentRepository.findByCategoryAndAvailability(category,isAvailable);
    }

    @Override
    public Equipment addEquipment(Equipment equipment) {
        if (equipment == null) {
            throw new IllegalArgumentException("Equipment cannot be null");
        }
        return equipmentRepository.saveEquipment(equipment);
    }

    @Override
    public Equipment updateEquipment(String equipmentId, Equipment equipment) {
        if (equipmentId == null || equipmentId.isBlank()) {
            throw new IllegalArgumentException("Equipment ID cannot be null or empty");
        }

        Equipment existing = equipmentRepository.findEquipmentById(equipmentId);
        if (existing == null) {
            throw new IllegalArgumentException("Equipment not found with ID: " + equipmentId);
        }

        // Update fields (you can fine-tune this if partial updates are allowed)
        existing.setName(equipment.getName());
        existing.setCategory(equipment.getCategory());
        existing.setDescription(equipment.getDescription());
        existing.setTotalQuantity(equipment.getTotalQuantity());
        existing.setAvailableQuantity(equipment.getAvailableQuantity());
        existing.setCondition(equipment.getCondition());
        existing.setAvailable(equipment.isAvailable());
        existing.setImageUrl(equipment.getImageUrl());

        return equipmentRepository.updateEquipment(existing);
    }

    @Override
    public void deleteEquipment(String equipmentId) {
        if (equipmentId == null || equipmentId.isBlank()) {
            throw new IllegalArgumentException("Equipment ID cannot be null or empty");
        }

        Equipment existing = equipmentRepository.findEquipmentById(equipmentId);
        if (existing == null) {
            throw new IllegalArgumentException("Equipment not found with ID: " + equipmentId);
        }

        equipmentRepository.deleteEquipmentById(equipmentId);
    }


}
