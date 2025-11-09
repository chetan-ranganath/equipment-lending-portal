package com.fullstack.equipmentlendingportal.config;

import com.fullstack.equipmentlendingportal.entity.BaseResponse;
import com.mongodb.MongoWriteException;
import com.mongodb.MongoWriteConcernException;
import com.mongodb.MongoTimeoutException;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Slf4j
@Aspect
@Component
public class RepositoryErrorAspect {

    @Around("execution(* com.fullstack.equipmentlendingportal.controller..*(..))")
    public Object handleMongoRepositoryErrors(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            return joinPoint.proceed();
        } catch (DuplicateKeyException ex) {
            log.error("Duplicate key error in {}: {}", joinPoint.getSignature(), ex.getMessage());
            BaseResponse response = new BaseResponse(
                    "MONGO_DUPLICATE_KEY",
                    "Duplicate record: a unique field already exists.",
                    null
            );
            return ResponseEntity.badRequest().body(response);
        }
        catch (MongoWriteException | MongoWriteConcernException ex) {
            log.error("Mongo write error in {}: {}", joinPoint.getSignature(), ex.getMessage());
            BaseResponse response = new BaseResponse(
                    "MONGO_WRITE_ERROR",
                    "Failed to write data to MongoDB. Please retry.",
                    null
            );
            return ResponseEntity.internalServerError().body(response);
        }
        catch (IllegalStateException ex) {
            log.error("IllegalStateException at {}: {}", joinPoint.getSignature(), ex.getMessage(), ex);
            BaseResponse response = new BaseResponse(
                    "400",
                    ex.getLocalizedMessage(),
                    null
            );
            return ResponseEntity.badRequest().body(response);
        }
        catch (MongoTimeoutException ex) {
            log.error("Mongo connection timeout in {}: {}", joinPoint.getSignature(), ex.getMessage());
            BaseResponse response = new BaseResponse(
                    "MONGO_TIMEOUT",
                    "Database connection timed out. Please try again later.",
                    null
            );
            return ResponseEntity.internalServerError().body(response);
        } catch (DataAccessException ex) {
            log.error("Spring Data access error in {}: {}", joinPoint.getSignature(), ex.getMessage());
            BaseResponse response = new BaseResponse(
                    "DATA_ACCESS_ERROR",
                    "A data access issue occurred while querying MongoDB.",
                    null
            );
            return ResponseEntity.internalServerError().body(response);
        } catch (Exception ex) {
            log.error("Unexpected repository error in {}: {}", joinPoint.getSignature(), ex.getMessage(), ex);
            BaseResponse response = new BaseResponse(
                    "REPO_ERROR",
                    "An unexpected error occurred while accessing the database.",
                    null
            );
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
