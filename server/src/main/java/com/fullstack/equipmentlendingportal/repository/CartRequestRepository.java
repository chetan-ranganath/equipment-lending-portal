package com.fullstack.equipmentlendingportal.repository;

import com.fullstack.equipmentlendingportal.entity.CartRequest;

import java.util.List;
import java.util.Optional;

public interface CartRequestRepository {

    CartRequest save(CartRequest request);

    Optional<CartRequest> findById(String id);

    List<CartRequest> findByUserId(String username);

    List<CartRequest> findAll();

    void deleteById(String id);
}
