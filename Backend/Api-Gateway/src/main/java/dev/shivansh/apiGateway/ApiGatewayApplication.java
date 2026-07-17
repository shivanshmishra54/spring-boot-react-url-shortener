package dev.shivansh.apiGateway;

import dev.shivansh.apiGateway.Config.JwtAuthFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


import static org.springframework.cloud.gateway.server.mvc.filter.LoadBalancerFilterFunctions.lb;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

	private final JwtAuthFilter jwtAuthFilter;

	public ApiGatewayApplication(JwtAuthFilter jwtAuthFilter) {
		this.jwtAuthFilter = jwtAuthFilter;
	}

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Bean
	public RouterFunction<ServerResponse> urlShortenerRoute() {
		return route("url-shortener-route")
				.route(RequestPredicates.path("/api/v1/**"), http())
				.filter(lb("URL-SHORTENING-SERVICE"))
				.filter(jwtAuthFilter) // Secure this endpoint with JWT validation
				.build();
	}

	/**
	 * Public route — /auth/login and /auth/register bypass the JWT filter.
	 * These requests are forwarded directly to URL-SHORTENING-SERVICE.
	 */
	@Bean
	public RouterFunction<ServerResponse> authRoute() {
		return route("auth-route")
				.route(RequestPredicates.path("/auth/**"), http())
				.filter(lb("URL-SHORTENING-SERVICE")) // No jwtAuthFilter here — public
				.build();
	}

	@Bean
	public RouterFunction<ServerResponse> redirectRoute() {
		return route("redirect-route")
				.route(RequestPredicates.path("/{shortUrl}"), http())
				.filter(lb("REDIRECT-SERVICE")) // Publicly accessible
				.build();
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
						.allowedHeaders("*");
			}
		};
	}
}
