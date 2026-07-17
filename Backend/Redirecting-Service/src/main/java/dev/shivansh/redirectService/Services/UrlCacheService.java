package dev.shivansh.redirectService.Services;

import dev.shivansh.redirectService.Repository.RedirectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UrlCacheService {

    private final RedirectRepository redirectRepository;

    @Cacheable(value = "urls", key = "#shortUrl")
    public String getOriginalUrl(String shortUrl) {
        return redirectRepository.findByShortUrl(shortUrl)
                .map(dev.shivansh.redirectService.Entity.Url::getUrl)
                .orElseThrow(() -> new RuntimeException("Short URL not found"));
    }
}
