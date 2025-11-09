package com.fullstack.equipmentlendingportal.repository;

import com.fullstack.equipmentlendingportal.config.AppConstants;
import com.fullstack.equipmentlendingportal.entity.Equipment;
import com.fullstack.equipmentlendingportal.entity.EquipmentCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

// Exceptions from this class is handled by AOP
@Repository
public class EquipmentRepositoryImpl implements EquipmentRepository{

    @Autowired
    MongoTemplate mongoTemplate;

    @Value("${collection.name.equipment}")
    private String equipmentCollectionName;

    @Autowired
    AppConstants appConstants;


    //pagination to be added
    @Override
    public List<Equipment> findAllEquipments() {
        List<Equipment> equipmentList =  mongoTemplate.findAll(Equipment.class,equipmentCollectionName);
        return equipmentList;
    }

    @Override
    public Equipment findEquipmentById(String equipmentId) {
        Query query = new Query();
        query.addCriteria(Criteria.where(appConstants.getEquipmentConstants().getEquipmentId()).is(equipmentId));
        return mongoTemplate.findOne(query,Equipment.class,equipmentCollectionName);
    }

    @Override
    public List<Equipment> findByCategory(EquipmentCategory category) {
        Query query = new Query(Criteria.where(appConstants.getEquipmentConstants().getCategory()).is(category));
        return mongoTemplate.find(query, Equipment.class);
    }

    @Override
    public List<Equipment> findByAvailability(boolean available) {
        Query query = new Query(Criteria.where(appConstants.getEquipmentConstants().getIsAvailable()).is(available));
        return mongoTemplate.find(query, Equipment.class);
    }

    @Override
    public List<Equipment> findByCategoryAndAvailability(EquipmentCategory category, boolean available) {
        Query query = new Query(Criteria.where(appConstants.getEquipmentConstants().getCategory()).is(category).and(appConstants.getEquipmentConstants().getIsAvailable()).is(available));
        return mongoTemplate.find(query, Equipment.class);
    }

    @Override
    public Equipment updateEquipmentQuantity(String equipmentId, int newAvailableQuantity) {
        Query query = new Query();
        query.addCriteria(Criteria.where("equipmentId").is(equipmentId));

        Update update = new Update();
        update.set("availableQuantity", newAvailableQuantity);

        // Returns the updated document
        return mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                Equipment.class,
                equipmentCollectionName
        );
    }

    @Override
    public Equipment saveEquipment(Equipment equipment) {
        return mongoTemplate.save(equipment, equipmentCollectionName);
    }

    @Override
    public Equipment updateEquipment(Equipment equipment) {
        Query query = new Query(Criteria.where("equipmentId").is(equipment.getEquipmentId()));

        Update update = new Update()
                .set("name", equipment.getName())
                .set("category", equipment.getCategory())
                .set("description", equipment.getDescription())
                .set("totalQuantity", equipment.getTotalQuantity())
                .set("availableQuantity", equipment.getAvailableQuantity())
                .set("condition", equipment.getCondition())
                .set("isAvailable", equipment.isAvailable())
                .set("imageUrl", equipment.getImageUrl());

        return mongoTemplate.findAndModify(
                query,
                update,
                FindAndModifyOptions.options().returnNew(true),
                Equipment.class,
                equipmentCollectionName
        );
    }

    @Override
    public void deleteEquipmentById(String equipmentId) {
        Query query = new Query(Criteria.where(appConstants.getEquipmentConstants().getEquipmentId()).is(equipmentId));
        mongoTemplate.remove(query, Equipment.class, equipmentCollectionName);
    }
}
