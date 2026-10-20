package br.com.mage.certmanager.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

// HIGHEST_PRECEDENCE: este handler é consultado antes dos demais @RestControllerAdvice,
// então um handler genérico de Exception (se existir) não engole estes casos.
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ApiErrorHandler {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record ApiError(
            LocalDateTime timestamp,
            int status,
            String error,
            String path,
            Map<String, String> fields
    ) {
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                     HttpServletRequest request) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> fields.putIfAbsent(e.getField(), e.getDefaultMessage()));

        ApiError body = new ApiError(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "Dados inválidos",
                request.getRequestURI(),
                fields
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }


    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatus(ResponseStatusException ex,
                                                         HttpServletRequest request) {
        int code = ex.getStatusCode().value();
        HttpStatus status = HttpStatus.resolve(code);
        String message = ex.getReason() != null
                ? ex.getReason()
                : (status != null ? status.getReasonPhrase() : "Erro");

        ApiError body = new ApiError(LocalDateTime.now(), code, message, request.getRequestURI(), null);
        return ResponseEntity.status(code).body(body);
    }
}