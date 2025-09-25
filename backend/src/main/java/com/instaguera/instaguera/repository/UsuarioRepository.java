package com.instaguera.instaguera.repository;

import com.instaguera.instaguera.model.Usuario;
import com.instaguera.instaguera.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByRole(Role role);
}