package com.fullstack.equipmentlendingportal.util;

import com.fullstack.equipmentlendingportal.config.AppConstants;
import com.fullstack.equipmentlendingportal.entity.BaseResponse;
import com.fullstack.equipmentlendingportal.entity.Equipment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.support.BindStatus;

import java.util.List;

@Component
public class HandleResponse {
    @Autowired
    AppConstants appConstants;

    public  ResponseEntity<BaseResponse> onError(String code, String message) {
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

    public ResponseEntity<?> isValidEquipmentData(List<Equipment> equipmentList){
        if (equipmentList.isEmpty()){
            return onError(appConstants.getErrorCodes().getEquipmentNotFoundCode(),
                    appConstants.getErrorCodes().getEquipmentNotFoundMessage());
        }
        else
            return ResponseEntity.ok(equipmentList);
    }
}
