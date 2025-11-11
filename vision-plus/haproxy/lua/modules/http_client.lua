-- HTTP Client Module for HAProxy Authentication
local http = require("http")
-- Use direct references to modules loaded in main.lua
-- These will be provided by the main script

local HttpClient = {}

-- Prepare request options for authentication request
function HttpClient.prepare_req_options(txn, method)
    local headers = {
        ["X-Original-Request"] = txn.sf:path(),
        ["Cookie"] = txn.sf:req_fhdr("cookie")
    }
    
    -- Check for API key authentication headers
    local api_key = txn.sf:req_fhdr("x-api-key")
    local timestamp = txn.sf:req_fhdr("x-timestamp")
    local nonce = txn.sf:req_fhdr("x-nonce")
    local signature = txn.sf:req_fhdr("x-signature")
    
    -- If API key headers are present, forward them to the auth service
    if api_key then
        headers["X-API-Key"] = api_key
        txn:Debug("Forwarding X-API-Key header to auth service")
    end
    
    if timestamp then
        headers["X-Timestamp"] = timestamp
        txn:Debug("Forwarding X-Timestamp header to auth service")
    end
    
    if nonce then
        headers["X-Nonce"] = nonce
        txn:Debug("Forwarding X-Nonce header to auth service")
    end
    
    if signature then
        headers["X-Signature"] = signature
        txn:Debug("Forwarding X-Signature header to auth service")
    end
    
    local url = Config.auth_service.api_url .. Config.auth_service.api_path
    local data = {
        url = url,
        method = method,
        headers = headers,
        body = "",
        timeout = Config.auth_service.timeout_ms
    }

    return data
end

-- Make HTTP request to authentication service
function HttpClient.do_http_req(txn)
    local req_options = HttpClient.prepare_req_options(txn, "GET")
    
    -- Log that we're making a request
    -- Using Debug level instead of Info to avoid duplicate logs
    txn:Debug("Making auth request to: " .. req_options.url)
    
    -- Start timer for the HTTP request
    local http_start_time = os.clock()
    
    -- Use the HTTP client library to make a real request
    local res, err = http.get{
        url = req_options.url,
        headers = req_options.headers,
        timeout = req_options.timeout / 1000 -- Convert from ms to seconds
    }
    
    -- Calculate and log the HTTP request time
    local http_end_time = os.clock()
    local http_time_taken = (http_end_time - http_start_time) * 1000 -- Convert to milliseconds
    Logger.log_timing(txn, "HTTP client request", http_time_taken)
    
    if err then
        txn:Debug("HTTP request error: " .. tostring(err))
        
        -- Return an error response
        return {
            status = 500,
            body = [[{"success":false,"message":"Authentication service unavailable"}]]
        }
    end
    
    -- Check if status exists before logging it
    local status = res.status_code or res.status or 200
    txn:Debug("HTTP request completed successfully with status: " .. status)
    
    -- Convert to our expected response format with nil checks
    local response = {
        status = status,
        body = res.content or ""
    }
    
    txn:Debug("Received response from auth-service: " .. tostring(response.status or "unknown"))
    
    -- Print the full JSON response
    if response.body then
        txn:Debug("Response body: " .. response.body)
        
        -- Parse the JSON using our custom parser
        local success, parsed_json = pcall(function() return JSON:decode(response.body) end)
        if success and parsed_json then
            txn:Debug("Parsed JSON successfully")
        else
            txn:Debug("Failed to parse JSON response")
            parsed_json = {success = false, message = "Invalid JSON response"}
        end
    end
    
    return response
end

return HttpClient
