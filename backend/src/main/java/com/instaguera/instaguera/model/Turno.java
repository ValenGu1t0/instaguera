package com.instaguera.instaguera.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "turno")
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private OffsetDateTime fechaHora;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoTurno estado = EstadoTurno.SOLICITADO;

    @Column(length = 500)
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Usuario cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dueno_id", nullable = false)
    private Usuario dueno;

    public Turno() {}

    public Turno(OffsetDateTime fechaHora, EstadoTurno estado, String descripcion, Usuario cliente, Usuario dueno) {
        this.fechaHora = fechaHora;
        this.estado = estado;
        this.descripcion = descripcion;
        this.cliente = cliente;
        this.dueno = dueno;
    }

    // Getters y setters
    public Long getId() { return id; }
    public OffsetDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(OffsetDateTime fechaHora) { this.fechaHora = fechaHora; }
    public EstadoTurno getEstado() { return estado; }
    public void setEstado(EstadoTurno estado) { this.estado = estado; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Usuario getCliente() { return cliente; }
    public void setCliente(Usuario cliente) { this.cliente = cliente; }
    public Usuario getDueno() { return dueno; }
    public void setDueno(Usuario dueno) { this.dueno = dueno; }
}

