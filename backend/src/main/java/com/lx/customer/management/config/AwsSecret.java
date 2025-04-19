package com.lx.customer.management.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AwsSecret {
    private String username;
    private String password;
    private String host;
    private String port;
    private String engine;
    private String dbInstanceIdentifier;
}
