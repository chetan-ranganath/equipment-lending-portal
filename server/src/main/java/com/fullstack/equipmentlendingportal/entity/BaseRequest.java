package com.fullstack.equipmentlendingportal.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class BaseRequest {
    @JsonProperty("username")
    private String userName;

    @JsonProperty("password")
    private String password;

    @JsonProperty("role")
    private String role;

    @JsonProperty("phone")
    private String phone;

    private String trackingHeader;
}