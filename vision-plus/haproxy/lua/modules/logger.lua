-- Logger Module for HAProxy Authentication

local Logger = {}

-- Log levels
Logger.LEVELS = {
    DEBUG = "debug",
    INFO = "info",
    WARNING = "warning",
    ERROR = "error"
}

-- Function to log messages with consistent format
function Logger.log(txn, level, message, include_request_id)
    -- Default to info level if not specified
    level = level or Logger.LEVELS.INFO
    
    -- Get request ID if available and requested
    local request_id_prefix = ""
    if include_request_id and txn then
        local request_id = txn.sf:req_fhdr("X-Vision-Request-ID") or ""
        if request_id and request_id ~= "" then
            request_id_prefix = "[" .. request_id .. "] "
        end
    end
    
    -- Format the message
    local formatted_message = request_id_prefix .. message
    
    -- Log at the appropriate level
    if level == Logger.LEVELS.ERROR then
        core.Alert(formatted_message)
    elseif level == Logger.LEVELS.WARNING then
        core.Warning(formatted_message)
    elseif level == Logger.LEVELS.INFO then
        core.Info(formatted_message)
    else
        core.Debug(formatted_message)
    end
end

-- Log timing information at INFO level
function Logger.log_timing(txn, operation, time_ms)
    local formatted_time = string.format("%.2f", time_ms)
    local message = operation .. " time: " .. formatted_time .. " ms"
    Logger.log(txn, Logger.LEVELS.INFO, message, true)
end

-- Log debug information
function Logger.debug(txn, message)
    Logger.log(txn, Logger.LEVELS.DEBUG, message, true)
end

-- Log info information
function Logger.info(txn, message)
    Logger.log(txn, Logger.LEVELS.INFO, message, true)
end

-- Log warning information
function Logger.warning(txn, message)
    Logger.log(txn, Logger.LEVELS.WARNING, message, true)
end

-- Log error information
function Logger.error(txn, message)
    Logger.log(txn, Logger.LEVELS.ERROR, message, true)
end

return Logger
