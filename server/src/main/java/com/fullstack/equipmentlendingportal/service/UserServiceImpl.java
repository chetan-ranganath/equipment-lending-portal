package com.fullstack.equipmentlendingportal.service;

import com.fullstack.equipmentlendingportal.entity.BaseRequest;
import com.fullstack.equipmentlendingportal.entity.BaseResponse;
import com.fullstack.equipmentlendingportal.entity.User;
import com.fullstack.equipmentlendingportal.exception.BaseException;
import com.fullstack.equipmentlendingportal.repository.UserRepository;
import com.fullstack.equipmentlendingportal.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import java.util.Optional;

@Service
@Slf4j
public class UserServiceImpl implements UserService{
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtil jwtUtil;

    @Override
    public BaseResponse registerUser(BaseRequest request) {
        try {
            User user = new User();
            user.setUsername(request.getUserName());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole());
            user.setCreatedAt(LocalDate.now().toString());
            userRepository.registerUser(user);
            return new BaseResponse("201", "User Registered!", null);

        }
        catch (BaseException e){
            return new BaseResponse(e.getCode(), e.getMessage(), null);
        }
        catch (Exception e) {
            e.printStackTrace();
            return new BaseResponse("500", "Internal Server Error", null);
        }

    }

    @Override
    public BaseResponse loginUser(BaseRequest request) {
        System.out.println(request.getUserName());
        try {
            User user = userRepository.findByUsername(request.getUserName());
            if (user !=null ) {

                if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    return new BaseResponse("200",
                            "Login Successful",
                            jwtUtil.generateJwtToken(request.getRole(), request.getUserName()));
                } else {
                    return new BaseResponse("401", "Invalid password",null);
                }
            } else {
                log.info("User not found for the transaction" + request.getTrackingHeader());
                return new BaseResponse("404", "User not found!",null);
            }
        }

        catch (Exception e) {
            log.error(e.getMessage());
            return new BaseResponse("500", "Internal Server Error", null);
        }
    }
}
