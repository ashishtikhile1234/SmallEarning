package com.gigbuddy.dto.application;

import lombok.Data;

@Data
public class ApplicationRequest {
    private Long gigId;
    private String message;
}
