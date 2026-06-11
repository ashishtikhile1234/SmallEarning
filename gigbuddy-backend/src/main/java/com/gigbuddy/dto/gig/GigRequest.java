package com.gigbuddy.dto.gig;

import com.gigbuddy.model.enums.GigCategory;
import com.gigbuddy.model.enums.PayType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class GigRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Category is required")
    private GigCategory category;

    private String description;

    @NotNull(message = "Duration in hours is required")
    @Min(value = 1, message = "Duration must be at least 1 hour")
    private Integer durationHours;

    private LocalDate date;
    private LocalTime timeSlot;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Pay amount is required")
    @Positive(message = "Pay amount must be positive")
    private Double payAmount;

    @NotNull(message = "Pay type is required (HOURLY or FIXED)")
    private PayType payType;

    @NotNull(message = "Number of slots required")
    @Min(value = 1)
    private Integer slotsAvailable;
}
