package com.hahn.software.exception;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@ToString
public class CustomResponse extends RuntimeException {
    private String message;
    private HttpStatus status;

    public CustomResponse(String message, HttpStatus status) {
        this.message = message;
        this.status = status;
    }

}
