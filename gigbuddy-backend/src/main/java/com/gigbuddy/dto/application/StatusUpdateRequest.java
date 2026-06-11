package com.gigbuddy.dto.application;

import com.gigbuddy.model.enums.ApplicationStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private ApplicationStatus status;
}
