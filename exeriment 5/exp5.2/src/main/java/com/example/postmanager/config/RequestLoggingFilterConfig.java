package com.example.postmanager.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Configuration
public class RequestLoggingFilterConfig {
    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilterConfig.class);

    @Bean
    public OncePerRequestFilter requestLoggingFilter() {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain filterChain) throws ServletException, IOException {
                String requestId = request.getHeader("X-Request-Id");
                if (requestId == null || requestId.isBlank()) {
                    requestId = UUID.randomUUID().toString();
                }

                MDC.put("requestId", requestId);
                response.setHeader("X-Request-Id", requestId);

                long start = System.currentTimeMillis();
                try {
                    log.info("Incoming request method={} uri={}", request.getMethod(), request.getRequestURI());
                    filterChain.doFilter(request, response);
                } finally {
                    long duration = System.currentTimeMillis() - start;
                    log.info("Finished request method={} uri={} status={} durationMs={}",
                            request.getMethod(), request.getRequestURI(), response.getStatus(), duration);
                    MDC.remove("requestId");
                }
            }
        };
    }
}
