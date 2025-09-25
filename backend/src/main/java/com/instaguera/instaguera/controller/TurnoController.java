package com.instaguera.instaguera.controller;

import com.instaguera.instaguera.model.Turno;
import com.instaguera.instaguera.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/turnos")
public class TurnoController {

    @Autowired
    private TurnoRepository turnoRepository;

    // GET - TODOS los turnos
    @GetMapping
    public List<Turno> getAllTurnos() {
        return turnoRepository.findAll();
    }

    // GET - Turno por ID
    @GetMapping("/{id}")
    public ResponseEntity<Turno> getTurnoById(@PathVariable Long id) {
        Optional<Turno> turno = turnoRepository.findById(id);
        return turno.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST - Turno
    @PostMapping
    public Turno createTurno(@RequestBody Turno turno) {
        return turnoRepository.save(turno);
    }

    // PATCH - Turno
    @PatchMapping("/{id}")
    public ResponseEntity<Turno> updateTurno(@PathVariable Long id, @RequestBody Turno turnoDetails) {
        return turnoRepository.findById(id)
                .map(turno -> {
                    if (turnoDetails.getFechaHora() != null) turno.setFechaHora(turnoDetails.getFechaHora());
                    if (turnoDetails.getEstado() != null) turno.setEstado(turnoDetails.getEstado());
                    if (turnoDetails.getDescripcion() != null) turno.setDescripcion(turnoDetails.getDescripcion());
                    if (turnoDetails.getCliente() != null) turno.setCliente(turnoDetails.getCliente());
                    if (turnoDetails.getDueno() != null) turno.setDueno(turnoDetails.getDueno());

                    Turno updated = turnoRepository.save(turno);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Turno
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTurno(@PathVariable Long id) {
        return turnoRepository.findById(id)
                .map(turno -> {
                    turnoRepository.delete(turno);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}