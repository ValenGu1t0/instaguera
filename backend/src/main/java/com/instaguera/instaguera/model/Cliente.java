package com.instaguera.instaguera.model;

import jakarta.persistence.Entity;

@Entity
public class Cliente extends Persona {

    private String telefono;

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
