package dev.shivansh.urlsservice.Repository;

import dev.shivansh.urlsservice.Entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortUrl(String shortUrl);

    Optional<Url> findByUrl(String url);

    Optional<Url> findByUrlAndUsername(String url, String username);

    Optional<Url> findByUrlAndUsernameIsNull(String url);

    java.util.List<Url> findByUsername(String username);

    boolean existsByShortUrl(String shortUrl);


}