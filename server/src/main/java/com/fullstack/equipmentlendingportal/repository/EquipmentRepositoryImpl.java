package com.fullstack.equipmentlendingportal.repository;

import com.fullstack.equipmentlendingportal.config.AppConstants;
import com.fullstack.equipmentlendingportal.entity.Equipment;
import com.fullstack.equipmentlendingportal.entity.EquipmentCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
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
}
