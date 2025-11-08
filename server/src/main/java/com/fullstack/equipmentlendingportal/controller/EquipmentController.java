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
    public ResponseEntity<?> getEquipments(@RequestParam(required = false) EquipmentCategory category, @RequestParam(required = false) Boolean available) {
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

        if  (equipmentList != null && !equipmentList.isEmpty()){
            return ResponseEntity.ok(equipmentList);
        }
        else {
            return handleResponse.onError(constants.getErrorCodes().getEquipmentNotFoundCode(),constants.getErrorCodes().getEquipmentNotFoundMessage());
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

        @GetMapping
	public List<Equipment> getAllEquipment()
	{
		return repo.findAll();
	}
    
    @PostMapping
	public ResponseEntity<Equipment> addEquipment(@RequestBody Equipment equip)
	{
		 Equipment savedEquipment = equipmentService.addEquipment(equip);
	     equip.markNew();
		 return ResponseEntity.status(HttpStatus.CREATED).body(savedEquipment);
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<Equipment> updateEquipment(@PathVariable String id, @RequestBody Equipment equip)
	{

		Equipment existing = repo.findByEquipmentId(id).orElseThrow(() -> new RuntimeException("Equipment not found"));
		
		for(Field field: Equipment.class.getDeclaredFields())
		{
			field.setAccessible(true);
			try
			{
				Object newValue = field.get(equip);
				
				if(newValue!=null)
				{
					field.set(existing, newValue);
				}
			}
			catch (IllegalAccessException e) {
	            e.printStackTrace();
		}
		}
		
		Equipment updated = repo.save(existing);

	    return ResponseEntity.ok(updated);
		
		
	}
	
	// DELETE equipment
    @DeleteMapping("/{id}")
    public void deleteEquipment(@PathVariable String id) {
        repo.deleteByEquipmentId(id);
    }

}
