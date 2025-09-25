package com.instaguera.instaguera.controller;

import com.instaguera.instaguera.model.Role;
import com.instaguera.instaguera.model.Usuario;
import com.instaguera.instaguera.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // GET - TODOS los usuarios - sin uso
    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // GET Clientes
    @GetMapping("/clientes")
    public List<Usuario> getClientes() {
        return usuarioRepository.findByRole(Role.CLIENTE);
    }

    // POST - Nuevo usuario
    @PostMapping
    public Usuario createUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // PATCH - Usuario
    @PatchMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, @RequestBody Usuario cambios) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    if (cambios.getNombre() != null) usuario.setNombre(cambios.getNombre());
                    if (cambios.getApellido() != null) usuario.setApellido(cambios.getApellido());
                    if (cambios.getCelular() != null) usuario.setCelular(cambios.getCelular());
                    if (cambios.getUsername() != null) usuario.setUsername(cambios.getUsername());
                    if (cambios.getEmail() != null) usuario.setEmail(cambios.getEmail());

                    usuarioRepository.save(usuario);
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE - Usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUsuario(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.ok("Usuario eliminado");
    }
}