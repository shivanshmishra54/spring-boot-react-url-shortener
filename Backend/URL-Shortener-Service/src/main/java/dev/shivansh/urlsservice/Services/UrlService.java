package dev.shivansh.urlsservice.Services;

import dev.shivansh.urlsservice.Entity.Url;
import dev.shivansh.urlsservice.Repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UrlService {

    private final UrlRepository urlRepository;

    @Value("${app.base-url}")
    private String baseUrl;

    private static final String BASE62 =
            "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public String getShortUrl(String longUrl, String username) {

        // Return existing URL if already present for this user/anonymous state
        Url existing = (username != null)
                ? urlRepository.findByUrlAndUsername(longUrl, username).orElse(null)
                : urlRepository.findByUrlAndUsernameIsNull(longUrl).orElse(null);

        if (existing != null) {
            return baseUrl + "/" + existing.getShortUrl();
        }

        // Generate a random 6-character short code and ensure it is unique
        String shortCode;
        do {
            shortCode = generateRandomShortCode();
        } while (urlRepository.existsByShortUrl(shortCode));

        // Save the new URL with the generated short code
        Url url = Url.builder()
                .url(longUrl)
                .shortUrl(shortCode)
                .username(username)
                .createdAt(LocalDateTime.now())
                .clicks(0)
                .build();

        urlRepository.save(url);

        return baseUrl + "/" + shortCode;
    }

    public java.util.List<Url> getHistory(String username) {
        return urlRepository.findByUsername(username);
    }

    public Url getAnalytics(String shortCode, String username) {
        Url url = urlRepository.findByShortUrl(shortCode)
                .orElseThrow(() -> new dev.shivansh.urlsservice.Exceptions.ResourceNotFoundException("URL not found"));

        if (url.getUsername() == null || !url.getUsername().equals(username)) {
            throw new dev.shivansh.urlsservice.Exceptions.UnauthorizedException("Access denied: You do not own this URL mapping");
        }

        return url;
    }

    public void deleteUrl(String shortCode, String username) {
        Url url = urlRepository.findByShortUrl(shortCode)
                .orElseThrow(() -> new dev.shivansh.urlsservice.Exceptions.ResourceNotFoundException("URL not found"));

        if (url.getUsername() == null || !url.getUsername().equals(username)) {
            throw new dev.shivansh.urlsservice.Exceptions.UnauthorizedException("Access denied: You do not own this URL mapping");
        }

        urlRepository.delete(url);
    }

    public String getOriginalUrlAndIncrementClicks(String shortCode) {
        Url url = urlRepository.findByShortUrl(shortCode)
                .orElseThrow(() -> new dev.shivansh.urlsservice.Exceptions.ResourceNotFoundException("URL not found"));
        
        url.setClicks(url.getClicks() + 1);
        urlRepository.save(url);
        
        return url.getUrl();
    }



    private String generateRandomShortCode() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(BASE62.charAt(java.util.concurrent.ThreadLocalRandom.current().nextInt(62)));
        }
        return sb.toString();
    }
}