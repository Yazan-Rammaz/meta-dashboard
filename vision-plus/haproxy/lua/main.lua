-- HAProxy Authentication Module - Main Entry Point
-- This is the main entry point for the HAProxy Lua authentication system

-- Create global tables for modules to access each other
_G.JSON = (loadfile "/usr/local/etc/haproxy/lua/modules/JSON.lua")()
_G.Config = (loadfile "/usr/local/etc/haproxy/lua/modules/config.lua")()
_G.Logger = (loadfile "/usr/local/etc/haproxy/lua/modules/logger.lua")()
_G.HttpClient = (loadfile "/usr/local/etc/haproxy/lua/modules/http_client.lua")()
_G.Cache = (loadfile "/usr/local/etc/haproxy/lua/modules/cache.lua")()
_G.AuthService = (loadfile "/usr/local/etc/haproxy/lua/modules/auth_service.lua")()

-- Create local references for convenience
local JSON = _G.JSON
local Config = _G.Config
local Logger = _G.Logger
local HttpClient = _G.HttpClient
local Cache = _G.Cache
local AuthService = _G.AuthService

-- Log initialization
core.Debug("HAProxy Authentication Module loaded successfully")

-- Main functions that will be exposed to HAProxy

-- Function to handle authentication verification
local function verify_auth(txn)
    -- Start timer for the entire verify_auth function
    local start_time = os.clock()
    
    -- Set default variables
    AuthService.set_default_vars(txn)
    
    -- Check if the request is authenticated
    AuthService.is_authenticated(txn)

	-- Check if the user is authorized to the resource
	AuthService.is_authorized(txn)

    -- Calculate and log the total time taken
    local end_time = os.clock()
    local time_taken = (end_time - start_time) * 1000 -- Convert to milliseconds
    Logger.log_timing(txn, "verify_auth total", time_taken)
    
    return
end

-- HTML-related functions have been removed as we now use static HTML files

-- To verify authentication and authorization of the request
core.register_action("verify_auth", {"http-req"}, verify_auth)

local function set_hdrs(txn)
    AuthService.set_normal_hdrs(txn)
end

-- To set basic minimum headers
core.register_action("set_basic_hdrs", {"http-req"}, set_hdrs)

-- End of file
