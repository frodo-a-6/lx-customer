package com.lx.customer.management.config;

import com.google.gson.Gson;
import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;

@Configuration
public class DataSourceConfig {

    private final Gson gson = new Gson();

    @Bean
    public DataSource dataSource() {
        try (SecretsManagerClient client = SecretsManagerClient.builder()
                .region(Region.EU_CENTRAL_1)
                .build()) {

            String secretString = client.getSecretValue(
                    GetSecretValueRequest.builder()
                            .secretId("rds-master-secret")
                            .build()
            ).secretString();

            AwsSecret secret = gson.fromJson(secretString, AwsSecret.class);

            final String url = "jdbc:postgresql://%s:%s/postgres".formatted(
                    secret.getHost(),
                    secret.getPort()
            );

            final HikariDataSource dataSource = new HikariDataSource();
            dataSource.setDriverClassName("org.postgresql.Driver");
            dataSource.setJdbcUrl(url);
            dataSource.setUsername(secret.getUsername());
            dataSource.setPassword(secret.getPassword());
            System.out.println("→ JDBC URL: " + url);
            return dataSource;
        } catch (Exception e) {
            throw new RuntimeException("DataSource creation failed", e);
        }
    }

}
