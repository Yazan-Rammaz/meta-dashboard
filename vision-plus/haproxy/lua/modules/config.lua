-- Configuration Module for HAProxy Authentication

-- Create global Config table
Config = {
    -- Authentication service configuration
    default = {
        base_url = "http://192.168.112.1:80"
    },

    auth_service = {
        api_url = "http://192.168.112.1:8081",
        api_path = "/api/v1/is_authenticated",
        timeout_ms = 5000 -- Timeout in milliseconds
    },
    
    -- Default paths and routes
    paths = {
        default_home_path = "/dashboard",
        signin_path = "/signin",
        forbidden_path = "/forbidden"
    },
    
    -- Cache settings
    cache = {
        enabled = true,
        expiration = 3600, -- Cache expiration time in seconds (1 hour)
        clean_interval = 300 -- Clean expired entries every 5 minutes
    },
    
    -- Header mappings for authenticated requests
    -- Format: { header_name = user_info_field }
    headers = {
        -- Standard user information headers
        auth_headers = {
            {"X-Vision-User-Id", "id"},
            {"X-Vision-User-Email", "email"},
            {"X-Vision-User-Role", "role"},
            {"X-Vision-User-Group", "user_group"},
            {"X-Vision-Merchant-Id", "merchant_id"},
            {"X-Vision-Home-App", "home_app"},
            {"X-Vision-Authenticated", "is_authenticated"}
        }
    }
}

return Config
