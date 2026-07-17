package dev.shivansh.urlsservice.Dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;
import lombok.Data;

@Data
public class UrlRequestDto {

    @NotBlank(message = "URL cannot be blank")
    @URL(message = "Invalid URL format")
    private String longUrl;

}
