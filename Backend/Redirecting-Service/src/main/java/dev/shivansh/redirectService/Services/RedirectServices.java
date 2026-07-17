package dev.shivansh.redirectService.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedirectServices {

    private final UrlCacheService urlCacheService;
    private final ClickTrackerService clickTrackerService;

    public String getOriginalUrl(String shortUrl) {
        String originalUrl = urlCacheService.getOriginalUrl(shortUrl);

        // Fire asynchronous click tracking
        clickTrackerService.incrementClickCountAsync(shortUrl);

        return originalUrl;
    }
}

