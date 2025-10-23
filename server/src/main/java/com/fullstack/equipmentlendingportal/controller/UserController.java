package com.fullstack.equipmentlendingportal.controller;

import com.fullstack.equipmentlendingportal.entity.BaseRequest;
import com.fullstack.equipmentlendingportal.entity.BaseResponse;
import com.fullstack.equipmentlendingportal.service.UserService;
import com.fullstack.equipmentlendingportal.util.RequestValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    RequestValidator validator;

    @PostMapping("/register")
    ResponseEntity<?> registerUser(@RequestHeader(name = "APIGW-Tracking-header", required = true) String trackingHeader,
                                   @RequestBody BaseRequest request) {

        request.setTrackingHeader(trackingHeader);

        List<BaseResponse> validationErrors = validator.validateRequest(request, false);

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(validationErrors);
        }

        BaseResponse response = userService.registerUser(request);

        if (response.getCode().equalsIgnoreCase("201")) {
            return ResponseEntity.ok(response);
        } else {
            return onError(response.getCode(), response.getMessage());
        }

    }

    @PostMapping("/login")
    ResponseEntity<?> userLogin(@RequestHeader(name = "APIGW-Tracking-header", required = true) String trackingHeader,
                                @RequestBody BaseRequest request) {
        request.setTrackingHeader(trackingHeader);

        List<BaseResponse> validationErrors = validator.validateRequest(request, true);

        if (!validationErrors.isEmpty()) {
            return ResponseEntity.badRequest().body(validationErrors);
        }
        BaseResponse response = userService.loginUser(request);

        if (response.getCode().equalsIgnoreCase("200")) {
            return ResponseEntity.ok(response);
        } else {
            return onError(response.getCode(), response.getMessage());
        }
    }


    private ResponseEntity<BaseResponse> onError(String code, String message) {
        int statusCode;
        try {
            statusCode = Integer.parseInt(code);
        } catch (NumberFormatException e) {
            statusCode = 500;
        }
        return switch (statusCode) {
            case 400 -> ResponseEntity.badRequest()
                    .body(new BaseResponse(code, message, null));
            case 401 -> ResponseEntity.status(401)
                    .body(new BaseResponse(code, message, null));
            case 404 -> ResponseEntity.status(404)
                    .body(new BaseResponse(code, message, null));
            default -> ResponseEntity.status(500)
                    .body(new BaseResponse("500", "Internal Server Error", null));
        };

    }
}
