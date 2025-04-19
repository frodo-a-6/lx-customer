package com.lx.customer.management.validator;

import com.lx.customer.management.model.Customer;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CustomerValidatorTest {
    private Validator validator;

    @BeforeEach
    void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void isInvalidWithoutFirstName() {
        Customer customer = new Customer();
        customer.setLastName("Doe");
        customer.setVatId("DE123456789");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("First name is required")));
    }

    @Test
    void isInvalidWithoutLastName() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setVatId("DE123456789");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Last name is required")));
    }

    @Test
    void isValidWithoutVatId() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertTrue(violations.isEmpty(), violations.stream().map(ConstraintViolation::getMessage).toList().toString());
    }

    @Test
    void isValidGerman() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setVatId("DE123456789");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertTrue(violations.isEmpty(), violations.stream().map(ConstraintViolation::getMessage).toList().toString());
    }

    @Test
    void isValidAustrian() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setVatId("ATU66572924");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertTrue(violations.isEmpty(), violations.stream().map(ConstraintViolation::getMessage).toList().toString());
    }

    @Test
    void isValidFrench() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setVatId("FR34349166025");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertTrue(violations.isEmpty(), violations.stream().map(ConstraintViolation::getMessage).toList().toString());
    }

    @Test
    void isValidBritish() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setVatId("GB999999999");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertTrue(violations.isEmpty(), violations.stream().map(ConstraintViolation::getMessage).toList().toString());
    }

    @Test
    void isValidDanish() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setVatId("DK79162728");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertTrue(violations.isEmpty(), violations.stream().map(ConstraintViolation::getMessage).toList().toString());
    }

    @Test
    void isValidNetherlands() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setVatId("NL818151778B01");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertTrue(violations.isEmpty(), violations.stream().map(ConstraintViolation::getMessage).toList().toString());
    }

    @Test
    void isInvalidGermanWithAdditionalVatIdChars() {
        Customer customer = new Customer();
        customer.setFirstName("John");
        customer.setLastName("Doe");
        customer.setVatId("DE123456789abc");

        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("VAT ID must match a valid format (e.g. DE123456789 or ATU12345678)")));
    }

}