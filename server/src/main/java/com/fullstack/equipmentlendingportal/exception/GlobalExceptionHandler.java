package com.fullstack.equipmentlendingportal.equipment.exception;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fullstack.equipmentlendingportal.equipment.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// To handle runtime exception
	@ExceptionHandler(RuntimeException.class)
	public ApiResponse<Object> handleRuntimeException(RuntimeException ex)
	{
		return new ApiResponse<>("error",ex.getMessage(),null);
	}
	
	// To handle other exceptions
	
	@ExceptionHandler(Exception.class)
	public ApiResponse<Object> handleExcepion(Exception e)
	{
		return new ApiResponse<>("error","Internal server error",null);
	}
	
	
}
