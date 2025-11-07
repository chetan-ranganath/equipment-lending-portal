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

     private String generateUniqueRandomId() {
        String id;
        do {
            int number = 1000 + RANDOM.nextInt(9000);
            id = String.valueOf(number);
        } while (equipmentRepository.existsById(id)); // ensures no duplicate
        return id;
    }
    
    @Override
    public Equipment addEquipment(Equipment equipment)
	{
		equipment.setEquipmentId(generateUniqueRandomId());
		return equipmentRepository.save(equipment);
	}
	
    @Override
	public Equipment updateEquipment(String id, Equipment equipment)
	{
		return equipmentRepository.findByEquipmentId(id)
				.map(eq->
				{
					eq.setName(equipment.getName());
					eq.setCategory(equipment.getCategory());
					eq.setCondition(equipment.getCondition());
					eq.setAvailableQuantity(equipment.getAvailableQuantity());
                    return repo.save(eq);
				})
				.orElse(null);
						
	}


}
