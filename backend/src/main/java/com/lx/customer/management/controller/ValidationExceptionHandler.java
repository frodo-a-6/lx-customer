package com.lx.customer.management.controller;

import jakarta.validation.ConstraintViolationException;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleConstraintViolationException(ConstraintViolationException ex) {
        return Map.of(
                "status", HttpStatus.BAD_REQUEST.value(),
                "message", "Validation failed",
                "errors", ex.getConstraintViolations()
                        .stream()
                        .map(violation -> Map.of(
                                "field", violation.getPropertyPath().toString(),
                                "message", violation.getMessage()
                        ))
                        .toList()
        );
    }
}
