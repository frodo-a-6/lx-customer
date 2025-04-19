package com.lx.customer.management.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "First name is required")
    private String firstName;
    @NotNull(message = "Last name is required")
    private String lastName;

    private String address;
    private String postalCode;
    private String city;

    @Column(length = 100)
    @Size(max = 100, message = "Details cannot exceed 100 characters")
    private String details;

    @Pattern.List({
        @Pattern(
                regexp = "^([A-Z]{2}).*$",
                message = "Country ISO code must be exactly 2 uppercase letters"
        ),
        @Pattern(
                regexp = "^(DE|AT|FR|GB|DK|NL).*$",
                message = "This country is not supported"
        ),
        @Pattern(
                regexp = "^(?:DE\\d{9}|" +
                        "ATU\\d{8}|" +
                        "FR[A-Z0-9]{2}\\d{9}|" +
                        "GB\\d{9}|GB\\d{12}|GB(GD|HA)[A-Z0-9]{3}\\d{12}|" +
                        "DK\\d{8}|" +
                        "NL\\d{9}B\\d{2})$",
                message = "VAT ID must match a valid format (e.g. DE123456789 or ATU12345678)"
        )
    })
    private String vatId;
}
