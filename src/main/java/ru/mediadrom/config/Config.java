package ru.mediadrom.config;

import jakarta.mail.MessagingException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

@Configuration
public class Config {
    @Bean
    public MimeMessageHelper mimeMessageHelper(JavaMailSender javaMailSender) throws MessagingException {
        return new MimeMessageHelper(javaMailSender.createMimeMessage(), true);
    }

}
