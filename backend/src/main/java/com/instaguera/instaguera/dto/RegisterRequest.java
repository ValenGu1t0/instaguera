package com.instaguera.instaguera.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {

    private String nombre;
    private String apellido;
    private String celular;
    private String username;
    private String password;
    private String email;
    private String role;
}