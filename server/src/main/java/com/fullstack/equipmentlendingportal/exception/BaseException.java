package com.fullstack.equipmentlendingportal.exception;

import lombok.*;

@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseException extends Exception{
    String code;
    String message;
}
