package com.instaguera.instaguera.dto;

import com.instaguera.instaguera.model.Usuario;

public class AuthResponse {

    private String token;
    private Usuario user;

    public AuthResponse(String token, Usuario user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public Usuario getUser() { return user; }
}