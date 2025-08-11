package com.instaguera.instaguera.model;

import jakarta.persistence.Entity;

@Entity
public class Dueño extends Persona {

    private String cuit;

    public String getCuit() {
        return cuit;
    }

    public void setCuit(String cuit) {
        this.cuit = cuit;
    }
}

