package com.instaguera.instaguera.controller;

import com.instaguera.instaguera.dto.AuthResponse;
import com.instaguera.instaguera.dto.RegisterRequest;
import com.instaguera.instaguera.model.Role;
import com.instaguera.instaguera.model.Usuario;
import com.instaguera.instaguera.repository.UsuarioRepository;
import com.instaguera.instaguera.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.instaguera.instaguera.dto.LoginRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Generamos token para la sesion
        String token = jwtUtil.generateToken(authentication.getName());

        // Buscamos el usuario a loguear...
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Si se da, devolvemos user y token que guardaremos en local en el front
        return new AuthResponse(token, usuario);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {

        // Primero chequeamos que no exista un mail igual ya
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }

        // Creamos el user, y encriptamos la contraseña
        Usuario nuevo = new Usuario(
                request.getNombre(),
                request.getApellido(),
                request.getCelular(),
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()), // importante encriptar
                Role.valueOf(request.getRole().toUpperCase()), // o fijar Role.CLIENTE
                request.getEmail()
        );

        usuarioRepository.save(nuevo);

        return ResponseEntity.ok("Usuario registrado con éxito");
    }
}