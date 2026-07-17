package dev.shivansh.urlsservice.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "urls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Url {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column( nullable = true ,unique = true, length = 15)
    private String shortUrl;

    @Column(nullable = true)
    private String username;


    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int clicks;

@PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.clicks = 0;
    }
}