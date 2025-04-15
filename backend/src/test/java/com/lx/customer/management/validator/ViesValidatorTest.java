package com.lx.customer.management.validator;

import jakarta.validation.ConstraintValidatorContext;
import java.net.MalformedURLException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

@Disabled
class ViesValidatorTest {
    private ViesValidator validator;

    @BeforeEach
    void setUp() throws MalformedURLException {
        validator = new ViesValidator();
    }

    @Test
    void isValidGerman() {
        assertValid("DE123456789");
    }

    @Test
    void isValidAustrian() {
        assertValid("ATU66572924");
    }

    @Test
    void isValidFrench() {
        assertValid("FR34349166025");
    }

    @Test
    void isValidBritish() {
        assertValid("GB999999999");
    }

    @Test
    void isValidDanish() {
        assertValid("DK79162728");
    }

    @Test
    void isValidNetherlands() {
        assertValid("NL818151778B01");
    }

    private void assertValid(String vatId) {
        assertTrue(validator.isValid(vatId, mock(ConstraintValidatorContext.class)));
    }
}