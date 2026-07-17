package dev.shivansh.apiGateway.Config;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.HandlerFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

@Component
public class JwtAuthFilter implements HandlerFilterFunction<ServerResponse, ServerResponse> {

    private final JwtUtils jwtUtils;

    public JwtAuthFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    public ServerResponse filter(ServerRequest request, HandlerFunction<ServerResponse> next) throws Exception {

        String path = request.path();
        String authHeader = request.headers().firstHeader("Authorization");

        // Public endpoints — no token required
        boolean isPublic = path.equals("/api/v1/shorten") || path.startsWith("/auth/");
        boolean hasToken = authHeader != null && authHeader.startsWith("Bearer ");

        if (!hasToken) {
            if (isPublic) {
                // Allow anonymous access to shorten (no username will be attached)
                return next.handle(request);
            }
            return ServerResponse.status(HttpStatus.UNAUTHORIZED)
                    .body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);

        if (!jwtUtils.validateToken(token)) {
            return ServerResponse.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired token");
        }

        // Extract username from JWT and forward it downstream as X-User-Username header
        String username = jwtUtils.extractUsername(token);
        ServerRequest modifiedRequest = ServerRequest.from(request)
                .header("X-User-Username", username)
                .build();

        return next.handle(modifiedRequest);
    }
}
