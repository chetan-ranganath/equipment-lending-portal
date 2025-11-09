package com.fullstack.equipmentlendingportal.repository;

import com.fullstack.equipmentlendingportal.config.AppConstants;
import com.fullstack.equipmentlendingportal.entity.CartRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class CartRequestRepositoryImpl implements CartRequestRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Value("${collection.name.cart-requests}")
    private String cartRequestCollectionName;

    @Autowired
    private AppConstants appConstants;

    @Override
    public CartRequest save(CartRequest request) {
        return mongoTemplate.save(request, cartRequestCollectionName);
    }

    @Override
    public Optional<CartRequest> findById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where(appConstants.getCartRequestConstants().getId()).is(id));
        CartRequest request = mongoTemplate.findOne(query, CartRequest.class, cartRequestCollectionName);
        return Optional.ofNullable(request);
    }

    @Override
    public List<CartRequest> findByUserId(String username) {
        Query query = new Query();
        query.addCriteria(Criteria.where(appConstants.getCartRequestConstants().getUserId()).is(username));
        return mongoTemplate.find(query, CartRequest.class, cartRequestCollectionName);
    }

    @Override
    public List<CartRequest> findAll() {
        return mongoTemplate.findAll(CartRequest.class, cartRequestCollectionName);
    }

    @Override
    public void deleteById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where(appConstants.getCartRequestConstants().getId()).is(id));
        mongoTemplate.remove(query, CartRequest.class, cartRequestCollectionName);
    }
}
