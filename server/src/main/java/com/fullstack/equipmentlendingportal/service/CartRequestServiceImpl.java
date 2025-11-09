package com.fullstack.equipmentlendingportal.service;

import com.fullstack.equipmentlendingportal.entity.CartRequest;
import com.fullstack.equipmentlendingportal.entity.CartRequestItem;
import com.fullstack.equipmentlendingportal.entity.Equipment;
import com.fullstack.equipmentlendingportal.repository.CartRequestRepository;
import com.fullstack.equipmentlendingportal.repository.EquipmentRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class CartRequestServiceImpl implements CartRequestService {

    @Autowired
    private CartRequestRepository cartRequestRepository;

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Override
    public CartRequest createCartRequest(CartRequest cartRequest) {
        log.info("Creating new cart request for userId={}", cartRequest.getUsername());

        for (CartRequestItem item : cartRequest.getItems()) {
            Equipment equipment = equipmentRepository.findEquipmentById(item.getEquipment().getEquipmentId());
            if (equipment == null) {
                throw new IllegalArgumentException("Invalid equipment ID: " + item.getEquipment().getEquipmentId());
            }
            int availableQuantity = equipment.getAvailableQuantity();
            if (item.getRequestedQuantity() > equipment.getAvailableQuantity()) {
                throw new IllegalArgumentException("Requested quantity exceeds available stock for " + equipment.getName());
            }
            equipmentRepository.updateEquipmentQuantity(equipment.getEquipmentId(),availableQuantity - item.getRequestedQuantity());

        }

        cartRequest.setStatus("PENDING");
        cartRequest.setRequestedAt(LocalDateTime.now());

        return cartRequestRepository.save(cartRequest);
    }

    @Override
    public List<CartRequest> getAllCartRequests() {
        List<CartRequest> requests = cartRequestRepository.findAll();
        if (requests == null || requests.isEmpty()) {
            throw new IllegalStateException("No cart requests found in the system.");
        }
        return requests;
    }

    @Override
    public List<CartRequest> getCartRequestsByUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("User ID cannot be null or empty.");
        }

        List<CartRequest> userRequests = cartRequestRepository.findByUserId(userId);
        if (userRequests == null || userRequests.isEmpty()) {
            throw new IllegalStateException("No cart requests found for userId: " + userId);
        }

        return userRequests;
    }

    @Override
    public CartRequest getCartRequestById(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Cart request ID cannot be null or empty.");
        }

        return cartRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cart request not found for id: " + id));
    }

    @Override
    public void deleteCartRequest(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Cart request ID cannot be null or empty.");
        }

        CartRequest existing = cartRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cannot delete — cart request not found for id: " + id));

        if (!"PENDING".equalsIgnoreCase(existing.getStatus())) {
            throw new IllegalStateException("Only PENDING requests can be deleted. Current status: " + existing.getStatus());
        }

        cartRequestRepository.deleteById(id);
    }

    @Override
    public CartRequest updateCartRequestStatus(String id, String status) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Request ID cannot be null or empty.");
        }

        // Allow APPROVED, DENIED, RETURN_REQUESTED
        if (!("APPROVED".equalsIgnoreCase(status) ||
                "DENIED".equalsIgnoreCase(status) ||
                "RETURNED".equalsIgnoreCase(status) ||
                "RETURN_REQUESTED".equalsIgnoreCase(status))) {
            throw new IllegalArgumentException(
                    "Invalid status: " + status + ". Must be APPROVED, DENIED or RETURN_REQUESTED or RETURNED."
            );
        }

        CartRequest request = cartRequestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cart request not found for id: " + id));

        // Only allow PENDING requests to be APPROVED or DENIED
        if ("APPROVED".equalsIgnoreCase(status) || "DENIED".equalsIgnoreCase(status)) {
            if (!"PENDING".equalsIgnoreCase(request.getStatus())) {
                throw new IllegalStateException(
                        "Only PENDING requests can be approved or denied. Current status: " + request.getStatus()
                );
            }
        }

        // Restore equipment quantity only on DENIED or RETURN_REQUESTED
        if ("DENIED".equalsIgnoreCase(status) || "RETURNED".equalsIgnoreCase(status)) {
            for (CartRequestItem item : request.getItems()) {
                Equipment equipment = equipmentRepository.findEquipmentById(item.getEquipment().getEquipmentId());
                if (equipment == null) {
                    log.warn("Equipment not found for request item: {}", item.getEquipment().getEquipmentId());
                    continue;
                }

                int restoredQuantity = equipment.getAvailableQuantity() + item.getRequestedQuantity();
                equipmentRepository.updateEquipmentQuantity(equipment.getEquipmentId(), restoredQuantity);

                log.info("Restored {} units of '{}' (Equipment ID: {}) after {} action",
                        item.getRequestedQuantity(), equipment.getName(), equipment.getEquipmentId(), status.toUpperCase());
            }
        }

        request.setStatus(status.toUpperCase());
        return cartRequestRepository.save(request);
    }


}
