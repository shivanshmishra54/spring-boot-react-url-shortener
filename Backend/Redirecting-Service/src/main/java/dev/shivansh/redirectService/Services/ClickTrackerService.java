package dev.shivansh.redirectService.Services;

import dev.shivansh.redirectService.Repository.RedirectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClickTrackerService {

    private final RedirectRepository redirectRepository;

    @Async
    @Transactional
    public void incrementClickCountAsync(String shortUrl) {
        redirectRepository.incrementClicksByShortUrl(shortUrl);
    }
}

