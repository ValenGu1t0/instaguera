package com.instaguera.instaguera.model;

import jakarta.persistence.Entity;

@Entity
public class Admin extends Persona {

    private String rol;

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

}
