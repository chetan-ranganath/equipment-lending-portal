package com.fullstack.equipmentlendingportal.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;


@Component
public class JwtUtil {

    @Value("${userauth.api.key}")
    String apiKey;


    public String generateJwtToken(String role, String userName) {
        return Jwts.builder()
                .subject(userName)
                .claim("role", role)
                .claim("userName", userName)
                .issuedAt(new Date())
                .expiration((new Date(System.currentTimeMillis() + 1000 * 60 * 60)))
                .signWith(getSigningKey())
                .compact();

    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(apiKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}


