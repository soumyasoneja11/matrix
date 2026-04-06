package com.mediscan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * Enterprise configuration to enable Spring Data MongoDB auditing.
 * This automatically populates @CreatedDate and @LastModifiedDate fields.
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {
}
