package com.fullstack.equipmentlendingportal.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:constants.properties")
@PropertySource(value = "file:/.config/constants.properties",ignoreResourceNotFound = true)
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppConstants {

    private UserConstants userConstants;
    private EquipmentConstants equipmentConstants;
    private ErrorCodes errorCodes;
    private CartRequestConstants cartRequestConstants;
    @Getter
    @Setter
    public static class UserConstants{
        private String username;
    }

    @Getter
    @Setter
    public static class EquipmentConstants{
        private String equipmentId;
        private String category;

        private String isAvailable;
    }

    @Getter
    @Setter
    public static class ErrorCodes{
        private String equipmentNotFoundMessage;
        private String equipmentNotFoundCode;
        private String internalServerErrorCode;
        private String internalServerErrorMessage;
        private String notFoundCode;
        private String notFoundMessage;

    }

    @Getter
    @Setter
    public static class CartRequestConstants {

        private  String id ;
        private  String userId ;
        private  String status;
    }

}
