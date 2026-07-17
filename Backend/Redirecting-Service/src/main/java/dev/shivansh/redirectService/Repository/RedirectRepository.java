package dev.shivansh.redirectService.Repository;

import dev.shivansh.redirectService.Entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RedirectRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortUrl(String shortUrl);

    @Modifying
    @Query("UPDATE Url u SET u.clicks = u.clicks + 1 WHERE u.shortUrl = :shortUrl")
    void incrementClicksByShortUrl(@Param("shortUrl") String shortUrl);
}
