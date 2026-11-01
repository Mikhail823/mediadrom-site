package ru.mediadrom.controllers;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mediadrom.dto.CalculationRequest;

import java.time.LocalDate;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final JavaMailSender mailSender;

    @Autowired
    public ApiController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping("/calculate-cost")
    public ResponseEntity<String> handleCalculation(@RequestBody CalculationRequest request) throws MessagingException {
        String subject = "Новая заявка на расчёт стоимости: " + request.getName();

        StringBuilder body = new StringBuilder();
        body.append("Имя: ").append(request.getName()).append("\n");
        body.append("Организация: ").append(request.getOrganization()).append("\n");
        body.append("Контакт: ").append(request.getContact()).append("\n");
        body.append("Услуга: ").append(request.getServiceType()).append("\n\n");

        if ("stands".equals(request.getServiceType())) {
            body.append("Формат: ").append(request.getStandFormat()).append("\n");
            body.append("Срок: ").append(request.getStandDuration()).append(" дн.\n");
        } else if ("flyers".equals(request.getServiceType())) {
            body.append("Тираж: ").append(request.getFlyersCirculation()).append(" шт.\n");
            body.append("Срок оказания: ").append(request.getFlyersDuration()).append(" дн.\n");
        } else if ("smm".equals(request.getServiceType())) {
            body.append("Постов: ").append(request.getSmmPosts()).append("\n");
            body.append("Маркировка: ").append(request.isSmmMarking() ? "Да" : "Нет").append("\n");
            body.append("Даты: с ").append(request.getSmmStartDate()).append(" по ").append(request.getSmmEndDate()).append("\n");
        }

        sendEmail("sistema823@yandex.ru", subject, body.toString());
        return ResponseEntity.ok("Заявка принята");
    }

    @SneakyThrows
    @PostMapping(value = "/review", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Async
    public ResponseEntity<?> saveReview(
            @RequestParam(name = "name") String name,
            @RequestParam(name = "organization") String organization,
            @RequestParam(name = "review") String review,
            @RequestParam(name = "file", required = false) MultipartFile photo) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        StringBuilder bodyReview = new StringBuilder();
        bodyReview.append("Имя: ").append(name.toString()).append("\n");
        bodyReview.append("Организация: ").append(organization.toString()).append("\n");
        bodyReview.append("Дата: ").append(LocalDate.now().toString()).append("\n");
        bodyReview.append("Отзыв: ").append(review).append("\n");


        helper.setTo("sistema823@yandex.ru");
        helper.setFrom("rabota822@bk.ru");
        helper.setSubject("Отзыв клиента " + name);
        helper.setText(bodyReview.toString(), false);

        if (photo != null && !photo.isEmpty()) {
            helper.addAttachment(Objects.requireNonNull(photo.getOriginalFilename()), new ByteArrayResource(photo.getBytes()));
        }

        mailSender.send(message);
        return ResponseEntity.ok(organization);
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage  msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setFrom("rabota822@bk.ru");
        msg.setSubject(subject);
        msg.setText(text);
        mailSender.send(msg);
    }
}
