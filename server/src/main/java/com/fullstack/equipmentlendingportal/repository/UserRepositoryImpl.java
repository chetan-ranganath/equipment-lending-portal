package com.fullstack.equipmentlendingportal.repository;

import com.fullstack.equipmentlendingportal.config.AppConstants;
import com.fullstack.equipmentlendingportal.entity.User;
import com.fullstack.equipmentlendingportal.exception.BaseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepositoryImpl implements UserRepository{

    @Autowired
    MongoTemplate mongoTemplate;

    @Value("${collection.name.user}")
    String userCollectionName;

    @Autowired
    AppConstants appConstants;

    @Override
    public User findByUsername(String username) {
        Query query = new Query();
        query.addCriteria(Criteria.where(appConstants.getUserConstants().getUsername()).is(username));
        User user = mongoTemplate.findOne(query, User.class,userCollectionName);
        return user;
    }

    @Override
    public void registerUser(User user) throws BaseException {
        Query query = new Query();
        query.addCriteria(Criteria.where(appConstants.getUserConstants().getUsername()).is(user.getUsername()));
        if(!mongoTemplate.exists(query,userCollectionName)) {
            mongoTemplate.save(user, userCollectionName);
        }
        else{
            throw new BaseException("400" , "Username already exists");
        }
    }


}
