package com.instaguera.instaguera.controller;

import com.instaguera.instaguera.model.Turno;
import com.instaguera.instaguera.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/turnos")
public class TurnoController {

    @Autowired
    private TurnoRepository turnoRepository;

    // GET - Listar todos los turnos
    @GetMapping
    public List<Turno> getAllTurnos() {
        return turnoRepository.findAll();
    }

    // POST - Crear un nuevo turno
    @PostMapping
    public Turno createTurno(@RequestBody Turno turno) {
        return turnoRepository.save(turno);
    }
}