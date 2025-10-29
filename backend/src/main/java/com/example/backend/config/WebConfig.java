package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // SPA 라우트를 index.html로 포워드
        registry.addViewController("/chat").setViewName("forward:/index.html");
        registry.addViewController("/chat/**").setViewName("forward:/index.html");
        registry.addViewController("/").setViewName("forward:/index.html");
    }
}