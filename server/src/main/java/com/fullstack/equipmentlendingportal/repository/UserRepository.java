package com.fullstack.equipmentlendingportal.repository;

import com.fullstack.equipmentlendingportal.entity.User;
import com.fullstack.equipmentlendingportal.exception.BaseException;

public interface UserRepository {

    User findByUsername(String username);

    void registerUser(User user) throws BaseException;
}
