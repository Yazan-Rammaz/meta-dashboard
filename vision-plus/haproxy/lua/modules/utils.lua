-- Utilities Module for HAProxy Authentication

-- Utils module will access JSON from the global scope
-- JSON is loaded in main.lua and available via _G.JSON

local Utils = {}

-- Function to create JSON-formatted logs with request ID
function Utils.json_log(txn, level, message, data)
    -- Get the request ID if available
    local request_id = ""
    if txn then
        request_id = txn.sf:req_fhdr("X-Vision-Request-ID") or ""
    end
    
    -- Create the base log object
    local log_obj = {
        timestamp = os.date("%Y-%m-%dT%H:%M:%S"),
        level = level or "info",
        message = message or "",
        request_id = request_id
    }
    
    -- Add any additional data
    if data and type(data) == "table" then
        for k, v in pairs(data) do
            log_obj[k] = v
        end
    end
    
    -- Convert to JSON and log
    local json_str = ""
    if _G.JSON then
        json_str = _G.JSON.encode(log_obj)
    else
        -- Fallback to simple string format if JSON module is not available
        json_str = '{"message":"' .. message .. '","level":"' .. (level or "info") .. '"}'
    end
    
    -- Use the appropriate log level
    if level == "error" then
        core.Alert(json_str)
    elseif level == "warning" then
        core.Warning(json_str)
    else
        core.Info(json_str)
    end
end

return Utils
