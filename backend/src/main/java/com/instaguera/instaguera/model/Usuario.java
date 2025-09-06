package com.instaguera.instaguera.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String celular;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Relación con turnos donde actúa como cliente
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Turno> turnosComoCliente = new ArrayList<>();

    // Relación con turnos donde actúa como dueño
    @OneToMany(mappedBy = "dueno", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Turno> turnosComoDueno = new ArrayList<>();

    public Usuario() {}

    public Usuario(String nombre, String apellido, String celular, String username, String password, Role role) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.celular = celular;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Getters y setters
    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getCelular() { return celular; }
    public void setCelular(String celular) { this.celular = celular; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}

