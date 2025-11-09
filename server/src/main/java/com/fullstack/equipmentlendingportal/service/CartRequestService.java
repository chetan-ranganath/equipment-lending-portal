package com.fullstack.equipmentlendingportal.service;

import com.fullstack.equipmentlendingportal.entity.CartRequest;
import java.util.List;

public interface CartRequestService {

    CartRequest createCartRequest(CartRequest cartRequest);

    List<CartRequest> getAllCartRequests();

    List<CartRequest> getCartRequestsByUserId(String username);

    CartRequest getCartRequestById(String id);

    void deleteCartRequest(String id);

    CartRequest updateCartRequestStatus(String id, String status);
}
