-- Authentication Service Module for HAProxy

-- Use direct references to modules loaded in main.lua
-- These will be provided by the main script

local AuthService = {}

-- Try to get authentication data from cache
local function get_auth_from_cache(txn, cookie)
    if not Config.cache.enabled or not cookie or cookie == "" then
        return nil
    end
    
    local cached_data = Cache.get_cached_auth(txn)
    if cached_data then
        txn:Debug("Using cached authentication data")
        return cached_data
    end
    
    txn:Debug("No cached data found")
    return nil
end

-- Make a request to the authentication service
local function fetch_auth_from_service(txn)
    txn:Debug("Making auth request to service: " .. Config.auth_service.api_path)
    return HttpClient.do_http_req(txn)
end

-- Process the authentication response and cache if needed
local function process_auth_response(txn, response, cookie)
    if not response or response.status ~= 200 or not response.body then
        txn:Info("Invalid or error response from auth service")
        return nil
    end
    
    -- Parse the JSON response
    local parsed_json = JSON:decode(response.body)
    
    -- Cache the parsed data if we have a cookie
    if parsed_json and cookie and cookie ~= "" and Config.cache.enabled then
        Cache.cache_auth_result(txn, parsed_json)
    end
    
    return parsed_json
end

-- Extract user information from authentication data
local function extract_user_info(auth_result)
    local user_info = {
        is_authenticated = false,
        home_page = Config.paths.default_home_path,
        id = nil,
        email = nil,
        role = nil,
        user_group = nil,
        merchant_id = nil,
        home_app = nil
    }
 
	if not auth_result or not auth_result.data then
		return user_info
	end

    user_info = auth_result.data
    user_info.is_authenticated = false
    user_info.home_page = Config.paths.default_home_path

    -- Set authentication status
    if auth_result.success == true or auth_result.status == "success" then
        user_info.is_authenticated = true
    end
    
    -- Extract home app for redirection (without leading slash for headers)
    if user_info.home_app then
        user_info.home_page = "/" .. user_info.home_app
    end
    
    return user_info
end

-- The mininum request headers
function AuthService.set_normal_hdrs(txn)
    txn.http:req_set_header("X-Vision-Base-Url", Config.default.base_url)
end

-- Set request headers from user info based on config mappings
local function set_req_hdrs(txn, user_info)
    -- Set normal headers
    AuthService.set_normal_hdrs(txn)

    -- Set standard auth headers from user_info
    if Config.headers and Config.headers.auth_headers then
        for _, header_mapping in ipairs(Config.headers.auth_headers) do
            local header_name = header_mapping[1]
            local field_name = header_mapping[2]
			txn.http:req_set_header(header_name, tostring(user_info[field_name]))
        end
    end
end

-- Set transaction variables from user info
local function set_txn_vars(txn, user_info)
    -- Set authentication status
    txn:set_var("txn.is_auth_success", user_info.is_authenticated)
    
    -- Set home page
    txn:set_var("txn.home_page", user_info.home_page)
    if user_info.home_page ~= Config.paths.default_home_path then
        txn:Debug("Setting home page to: " .. user_info.home_page)
    end
     
    -- Log authentication result
    if user_info.is_authenticated then
        txn:Debug("Authentication successful")
    else
        txn:Debug("Authentication failed")
    end
end

-- Check if a request is authenticated
function AuthService.is_authenticated(txn)
    -- Start timer for the entire is_authenticated function
    local start_time = os.clock()
    
    -- Log cache stats periodically
    Cache.log_stats(txn)
    
    -- Get cookie from request
    local cookie = txn.sf:req_fhdr("cookie")
    local auth_result = nil
    
    -- Try to get from cache first
    auth_result = get_auth_from_cache(txn, cookie)
    
    -- If not in cache, fetch from auth service
    if not auth_result then
        -- Start timer for the API request
        local api_start_time = os.clock()
        
        local response = fetch_auth_from_service(txn)
        
        -- Calculate and log the API request time
        local api_end_time = os.clock()
        local api_time_taken = (api_end_time - api_start_time) * 1000 -- Convert to milliseconds
        Logger.log_timing(txn, "auth_service API request", api_time_taken)
        
        auth_result = process_auth_response(txn, response, cookie)
    end
    
    -- Extract user information from auth data
    local user_info = extract_user_info(auth_result)
   
	local is_auth_success = user_info.is_authenticated 
	
	-- Calculate and log the total time taken for is_authenticated
	local end_time = os.clock()
	local time_taken = (end_time - start_time) * 1000 -- Convert to milliseconds
	Logger.log_timing(txn, "is_authenticated total", time_taken)
	
	if not user_info.is_authenticated then
		return is_auth_success
	end

    -- Set transaction variables from user info
    set_txn_vars(txn, user_info)

	-- Set request headers, will be used in the downstream application
	set_req_hdrs(txn, user_info)
 
    return is_auth_success
end

-- Extract app name from the request path
local function extract_app_name(path)
    -- Skip the leading slash and get first segment
    if path and path:len() > 1 then
        local first_segment = path:match("^/([^/]+)")
        return first_segment or ""
    end
    return ""
end

-- Check if a request is authorized
function AuthService.is_authorized(txn)
    -- Fetch request header X-Vision-User-Group for user_group
    local user_group = txn.sf:req_fhdr("x-vision-user-group") or ""
    local user_role = txn.sf:req_fhdr("x-vision-user-role") or ""

    -- Extract request path
    local request_path = txn.sf:path()

    -- Get the app_name from the path
    local app_name = extract_app_name(request_path)

    -- If the user_group is External and the app_name is "admin", deny access
    if user_group == "External" and app_name == "admin" then
		txn:set_var("txn.has_permission", false)
        txn:Debug("Authorization denied: External user attempted to access admin app")
    end

	if user_role ~= "Admin" and (user_group == "Internal" and app_name == "dashboard") then
		 txn:set_var("txn.has_permission", false)
		txn:Debug("Authorization denied: External user attempted to access Merchant app")
	end	

end

-- Handle events after successful authentication
function AuthService.on_auth_success_events(txn)
    local is_auth = txn.vars["txn.is_auth_success"] == "true"
    
    if is_auth then
        -- Additional logic for authenticated users can be added here
        -- For example, setting additional variables or performing other actions
    end
end

-- Set default transaction variables
function AuthService.set_default_vars(txn)
    txn:set_var("txn.is_auth_success", false)
    txn:set_var("txn.has_permission", true) -- TODO change me later
    txn:set_var("txn.home_page", Config.paths.default_home_path)
end

return AuthService
