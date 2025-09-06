package com.instaguera.instaguera.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desactiva protección CSRF para facilitar pruebas con Postman
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Permite TODAS las rutas sin autenticación
                )
                .formLogin(form -> form.disable()) // Desactiva el formulario de login
                .httpBasic(basic -> basic.disable()); // Desactiva autenticación básica

        return http.build();
    }
}