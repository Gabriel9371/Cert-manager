package br.com.mage.certmanager.handler;

import br.com.mage.certmanager.dto.StandardError;
import br.com.mage.certmanager.exception.CertificateNotFoundException;
import br.com.mage.certmanager.exception.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<StandardError> userNotFound(UserNotFoundException e, HttpServletRequest req){
        HttpStatus status = HttpStatus.NOT_FOUND;

        StandardError err = new StandardError(
                LocalDateTime.now(),
                status.value(),
                e.getMessage(),
                req.getRequestURI()
        );

        return ResponseEntity.status(status).body(err);
    }


    @ExceptionHandler(CertificateNotFoundException.class)
    public ResponseEntity<StandardError> certificateNotFound(CertificateNotFoundException e, HttpServletRequest req){

        HttpStatus status = HttpStatus.NOT_FOUND;

        StandardError err = new StandardError(
                LocalDateTime.now(),
                status.value(),
                e.getMessage(),
                req.getRequestURI()
        );

        return ResponseEntity.status(status).body(err);
    }
}
