package com.instaguera.instaguera;

import com.instaguera.instaguera.model.*;
import com.instaguera.instaguera.repository.TurnoRepository;
import com.instaguera.instaguera.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final TurnoRepository turnoRepository;

    public DataLoader(UsuarioRepository usuarioRepository, TurnoRepository turnoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.turnoRepository = turnoRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            // Crear dueño
            Usuario dueno = new Usuario(
                    "Carlos",
                    "Gómez",
                    "1122334455",
                    "tattoo_master",
                    "123456", // más adelante lo encriptaremos
                    Role.DUENO
            );

            // Crear cliente
            Usuario cliente = new Usuario(
                    "Juan",
                    "Pérez",
                    "1199887766",
                    "juanito",
                    "123456",
                    Role.CLIENTE
            );

            usuarioRepository.save(dueno);
            usuarioRepository.save(cliente);

            // Crear turno de prueba
            Turno turno = new Turno(
                    OffsetDateTime.now().plusDays(2), // fecha dentro de 2 días
                    EstadoTurno.SOLICITADO,
                    "Tatuaje de dragón en el brazo",
                    cliente,
                    dueno
            );

            turnoRepository.save(turno);

            System.out.println("✅ Datos de prueba insertados en la base de datos.");
        } else {
            System.out.println("ℹ️ La base de datos ya contiene datos, no se insertaron nuevos.");
        }
    }
}