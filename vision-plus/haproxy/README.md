# VisionPay Authentication Gateway

A robust, production-ready authentication and authorization gateway for VisionPay using HAProxy with Lua scripting. This gateway handles authentication flows, redirects users to their designated home apps, and provides comprehensive logging and performance metrics.

## Features

- **External HTTP Authentication**: Integrates with VisionPay's authentication service via HTTP
- **Dynamic Error Handling**: JSON responses for API clients, HTML pages for browsers
- **In-Memory Caching**: Caches authentication results for improved performance
- **Request ID Tracing**: Unique request IDs for end-to-end request tracking
- **Structured JSON Logging**: Comprehensive logging in JSON format
- **Performance Metrics**: Timing measurements for authentication flows
- **Modular Lua Code**: Well-organized, maintainable Lua modules

## Architecture

The gateway consists of the following components:

- **HAProxy 2.6**: Core proxy and load balancer
- **Lua Modules**: Custom authentication and routing logic
  - `main.lua`: Entry point for HAProxy Lua integration
  - `auth_service.lua`: Authentication logic and user info extraction
  - `http_client.lua`: HTTP client for external API calls
  - `cache.lua`: In-memory caching of authentication results
  - `logger.lua`: Structured logging with request ID tracing
  - `html_templates.lua`: HTML templates for browser error pages
  - `config.lua`: Centralized configuration

## Requirements

- Docker and Docker Compose
- External authentication service at `/api/v1/is_authenticated`

## Usage

### Starting the Gateway

```bash
# Build and start the container
docker-compose build
docker-compose up -d

# View logs
docker logs visionpay-haproxy

# Stop the container
docker-compose down
```

### Configuration

The main configuration files are:

- `haproxy.cfg`: HAProxy configuration
- `lua/modules/config.lua`: Lua configuration settings

### Authentication Flow

1. Gateway receives a request
2. Request is checked against the cache
3. If not in cache, external authentication service is called
4. User information and permissions are extracted
5. User is either:
   - Allowed to proceed to the requested resource
   - Redirected to their designated home app
   - Shown an error page (browser) or error JSON (API)

### Performance Monitoring

The gateway includes timing measurements for:

- Total authentication time
- External API request time
- HTTP client request time

These metrics are logged at INFO level with the request ID for tracing.

## Customization

### Changing the Authentication Service

Update the authentication service URL in `lua/modules/config.lua`:

```lua
Config = {
    auth_service = {
        base_url = "http://your-auth-service",
        auth_api_path = "/api/v1/is_authenticated",
        timeout_ms = 5000
    }
}
```

### Modifying Error Pages

Customize the HTML error templates in `lua/modules/html_templates.lua`.

## Troubleshooting

### Enabling Debug Logs

To see detailed debug logs, ensure the HAProxy configuration has:

```
log stdout format raw local0 debug
```

### Common Issues

- **Authentication Failures**: Check the external auth service connectivity
- **Performance Issues**: Monitor the timing logs for bottlenecks
- **Routing Problems**: Verify the home app paths in the configuration
