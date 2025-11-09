package com.fullstack.equipmentlendingportal.controller;

import com.fullstack.equipmentlendingportal.config.AppConstants;
import com.fullstack.equipmentlendingportal.entity.BaseResponse;
import com.fullstack.equipmentlendingportal.entity.CartRequest;
import com.fullstack.equipmentlendingportal.service.CartRequestService;
import com.fullstack.equipmentlendingportal.util.HandleResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/requests")
public class CartRequestController {

    @Autowired
    private CartRequestService cartRequestService;

    @Autowired
    private HandleResponse handleResponse;

    @Autowired
    private AppConstants appConstants;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping
    public ResponseEntity<?> createCartRequest(@RequestBody CartRequest cartRequest) {
        try {
            log.info("Received new cart request from user {}", cartRequest.getUsername());
            CartRequest created = cartRequestService.createCartRequest(cartRequest);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            log.error("Error creating cart request: {}", e.getMessage());
            return handleResponse.onError(
                    "400",
                    "Failed to create cart request: " + e.getMessage()
            );
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping
    public ResponseEntity<?> getAllCartRequests() {
        try {
            List<CartRequest> requests = cartRequestService.getAllCartRequests();
            if (requests.isEmpty()) {
                return handleResponse.onError(
                        appConstants.getErrorCodes().getNotFoundCode(),
                        appConstants.getErrorCodes().getEquipmentNotFoundMessage()
                );
            }
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            log.error("Error fetching cart requests: {}", e.getMessage());
            return handleResponse.onError("500", "Failed to fetch cart requests");
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getRequestsByUser(@PathVariable String username) {
        try {
            List<CartRequest> requests = cartRequestService.getCartRequestsByUserId(username);
            if (requests.isEmpty()) {
                return handleResponse.onError(
                        appConstants.getErrorCodes().getNotFoundCode(),
                        "No cart requests found for user: " + username
                );
            }
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            log.error("Error fetching requests for user {}: {}", username, e.getMessage());
            return handleResponse.onError("500", "Failed to fetch user cart requests");
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/{id}")
    public ResponseEntity<?> getCartRequestById(@PathVariable String id) {
        try {
            CartRequest request = cartRequestService.getCartRequestById(id);
            if (request == null) {
                return handleResponse.onError(
                        appConstants.getErrorCodes().getNotFoundCode(),
                        "Cart request not found for id: " + id
                );
            }
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            log.error("Error fetching cart request {}: {}", id, e.getMessage());
            return handleResponse.onError("500", "Failed to fetch cart request");
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCartRequest(@PathVariable String id) {
        try {
            cartRequestService.deleteCartRequest(id);
            return ResponseEntity.ok(new BaseResponse("200", "Cart request deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting cart request {}: {}", id, e.getMessage());
            return handleResponse.onError("500", "Failed to delete cart request");
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveCartRequest(@PathVariable String id) {
        try {
            log.info("Approving cart request {}", id);
            CartRequest updated = cartRequestService.updateCartRequestStatus(id, "APPROVED");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error approving cart request {}: {}", id, e.getMessage());
            return handleResponse.onError("500", "Failed to approve cart request");
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/{id}/deny")
    public ResponseEntity<?> denyCartRequest(@PathVariable String id) {
        try {
            log.info("Denying cart request {}", id);
            CartRequest updated = cartRequestService.updateCartRequestStatus(id, "DENIED");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error denying cart request {}: {}", id, e.getMessage());
            return handleResponse.onError("500", "Failed to deny cart request");
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/{id}/request-return")
    public ResponseEntity<?> requestReturnCartRequest(@PathVariable String id) {
        try {
            log.info("Marking cart request {} as RETURN_REQUESTED", id);
            CartRequest updated = cartRequestService.updateCartRequestStatus(id, "RETURN_REQUESTED");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error marking cart request {} as return requested: {}", id, e.getMessage());
            return handleResponse.onError("500", "Failed to mark cart request for return");
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PutMapping("/{id}/return")
    public ResponseEntity<?> returnCartRequest(@PathVariable String id) {
        try {
            log.info("Marking cart request {} as RETURN_REQUESTED", id);
            CartRequest updated = cartRequestService.updateCartRequestStatus(id, "RETURNED");
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            log.error("Error marking cart request {} as return requested: {}", id, e.getMessage());
            return handleResponse.onError("500", "Failed to mark cart request for return");
        }
    }

}
