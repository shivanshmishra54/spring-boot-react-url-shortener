package dev.shivansh.urlsservice.Controllers;

import dev.shivansh.urlsservice.Dto.UrlRequestDto;
import dev.shivansh.urlsservice.Dto.UrlResponseDto;
import dev.shivansh.urlsservice.Services.UrlService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @PostMapping("/shorten")
    public ResponseEntity<UrlResponseDto> getShortUrl(
            @Valid @RequestBody UrlRequestDto requestDto,
            @RequestHeader(value = "X-User-Username", required = false) String username) {

        String shortUrl = urlService.getShortUrl(requestDto.getLongUrl(), username);

        UrlResponseDto response = new UrlResponseDto();
        response.setShortUrl(shortUrl);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<java.util.List<dev.shivansh.urlsservice.Entity.Url>> getHistory(
            @RequestHeader(value = "X-User-Username") String username) {
        return ResponseEntity.ok(urlService.getHistory(username));
    }

    @GetMapping("/analytics/{shortCode}")
    public ResponseEntity<dev.shivansh.urlsservice.Entity.Url> getAnalytics(
            @PathVariable String shortCode,
            @RequestHeader(value = "X-User-Username") String username) {
        return ResponseEntity.ok(urlService.getAnalytics(shortCode, username));
    }

    @DeleteMapping("/delete/{shortCode}")
    public ResponseEntity<Void> deleteUrl(
            @PathVariable String shortCode,
            @RequestHeader(value = "X-User-Username") String username) {
        urlService.deleteUrl(shortCode, username);
        return ResponseEntity.noContent().build();
    }

}