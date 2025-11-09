package com.fullstack.equipmentlendingportal.security;

import com.fullstack.equipmentlendingportal.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filter that intercepts each request to validate JWT,
 * extract claims, and set authentication for secured endpoints.
 * Enforces admin-only routes authorization as configured.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    JwtUtil jwtUtil;

    /**
     * Validates JWT from Authorization header, sets security context,
     * and restricts access for admin-only endpoints.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Extract Authorization header
        String authHeader = request.getHeader("Authorization");

        // Proceed if header contains Bearer token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Validate JWT token
            if (jwtUtil.validateToken(token)) {
                // Extract claims from token
                Claims claims = jwtUtil.extractClaims(token);
                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                String path = request.getRequestURI();
                String method = request.getMethod();

                // Log role, path, and method for audit/debug
                System.out.println(role + " ++" + path + "++" + method );

                // Determine if endpoint is admin-only
                boolean isAdminOnly = (
                        path.matches(".*/approve$") ||
                                path.matches(".*/deny$") ||
                                (path.equals("/api/requests") && "GET".equalsIgnoreCase(method))
                );

                // Restrict access if user lacks admin role on admin-only endpoints
                if (isAdminOnly && !"ADMIN".equalsIgnoreCase(role)) {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Access denied: Admin privileges required.");
                    return;
                }

                // Authenticate and set context if token and role are valid
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                new User(username, "", Collections.emptyList()),
                                null,
                                Collections.emptyList()
                        );
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // Continue filter chain for all valid requests
        filterChain.doFilter(request, response);
    }
}
