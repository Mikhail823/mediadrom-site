package ru.mediadrom.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CalculationRequest {

    @NotNull(message = "Имя обязательно")
    private String name;
    private String organization;
    @Pattern(regexp = "^(?:\\+?\\d{10,15}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,})$",
            message = "Телефон или email некорректны")
    private String contact;
    private String serviceType;
    private String standFormat;
    private Integer standDuration;
    private Integer flyersCirculation;
    private Integer flyersDuration;
    private Integer smmPosts;
    private boolean smmMarking;
    private LocalDate smmStartDate;
    private LocalDate smmEndDate;
}
