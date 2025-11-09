package com.fullstack.equipmentlendingportal.controller;

import com.fullstack.equipmentlendingportal.config.AppConstants;
import com.fullstack.equipmentlendingportal.entity.BaseResponse;
import com.fullstack.equipmentlendingportal.entity.Equipment;
import com.fullstack.equipmentlendingportal.entity.EquipmentCategory;
import com.fullstack.equipmentlendingportal.service.EquipmentService;
import com.fullstack.equipmentlendingportal.util.HandleResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Stream;

@RequestMapping("/api/equipments")
@RestController
public class EquipmentController {

    @Autowired
    EquipmentService equipmentService;

    @Autowired
    HandleResponse handleResponse;

    @Autowired
    AppConstants constants;

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping
    public ResponseEntity<?> getEquipments(@RequestParam(required = false) EquipmentCategory category,
                                           @RequestParam(required = false) Boolean available) {
        List<Equipment> equipmentList;
        if (category != null && available != null) {
            equipmentList = equipmentService.findByCategoryAndAvailability(category, available);
        } else if (category != null) {
            equipmentList = equipmentService.findByCategory(category);
        } else if (available != null) {
            equipmentList = equipmentService.findByAvailability(available);
        } else {
            equipmentList = equipmentService.findAllEquipments();
        }

        if (equipmentList != null && !equipmentList.isEmpty()) {
            return ResponseEntity.ok(equipmentList);
        } else {
            return handleResponse.onError(
                    constants.getErrorCodes().getEquipmentNotFoundCode(),
                    constants.getErrorCodes().getEquipmentNotFoundMessage()
            );
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/{equipmentId}")
    public ResponseEntity<?> getEquipmentById(@PathVariable String equipmentId) {
        return equipmentService.findEquipmentById(equipmentId);
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            List<String> categories = Stream.of(EquipmentCategory.values()).map(Enum::name).toList();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            BaseResponse error = new BaseResponse("CATEGORY_FETCH_ERROR", "Error fetching categories: " + e.getMessage(), null);
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping
    public ResponseEntity<?> addEquipment(@RequestBody Equipment equipment) {
        try {
            Equipment created = equipmentService.addEquipment(equipment);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return handleResponse.onError(
                    "EQUIPMENT_ADD_ERROR",
                    "Failed to add equipment: " + e.getMessage()
            );
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/{equipmentId}")
    public ResponseEntity<?> updateEquipment(@PathVariable String equipmentId, @RequestBody Equipment equipment) {
        try {
            Equipment updated = equipmentService.updateEquipment(equipmentId, equipment);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return handleResponse.onError(
                    "EQUIPMENT_UPDATE_ERROR",
                    "Failed to update equipment: " + e.getMessage()
            );
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/{equipmentId}")
    public ResponseEntity<?> deleteEquipment(@PathVariable String equipmentId) {
        try {
            equipmentService.deleteEquipment(equipmentId);
            return ResponseEntity.ok(
                    new BaseResponse("200", "Equipment deleted successfully", null)
            );
        } catch (Exception e) {
            return handleResponse.onError(
                    "EQUIPMENT_DELETE_ERROR",
                    "Failed to delete equipment: " + e.getMessage()
            );
        }
    }
}
