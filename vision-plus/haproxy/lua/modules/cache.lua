-- Cache Module for HAProxy Authentication
-- Use direct references to modules loaded in main.lua
-- These will be provided by the main script

local Cache = {}

-- Initialize the cache storage
local cache_store = {}

-- Get default expiration time from config
local DEFAULT_EXPIRATION = Config.cache.expiration

-- Get the current timestamp
local function get_current_time()
    return os.time()
end

-- Generate a cache key from a cookie string
local function generate_key_from_cookie(cookie_str)
    if not cookie_str or cookie_str == "" then
        return nil
    end
    
    -- Use the entire cookie string as the key
    -- This ensures uniqueness based on all cookies
    return cookie_str
end

-- Set a value in the cache with expiration
function Cache.set(key, value, expiration)
    if not key then return false end
    
    expiration = expiration or DEFAULT_EXPIRATION
    local expires_at = get_current_time() + expiration
    
    cache_store[key] = {
        value = value,
        expires_at = expires_at
    }
    
    return true
end

-- Get a value from the cache
function Cache.get(key)
    if not key then return nil end
    
    local cache_entry = cache_store[key]
    if not cache_entry then
        return nil
    end
    
    -- Check if the entry has expired
    if get_current_time() > cache_entry.expires_at then
        -- Remove expired entry
        cache_store[key] = nil
        return nil
    end
    
    return cache_entry.value
end

-- Remove a value from the cache
function Cache.delete(key)
    if not key then return false end
    
    cache_store[key] = nil
    return true
end

-- Clear all entries from the cache
function Cache.clear()
    cache_store = {}
    return true
end

-- Get the number of entries in the cache
function Cache.size()
    local count = 0
    for _ in pairs(cache_store) do
        count = count + 1
    end
    return count
end

-- Clean expired entries from the cache
function Cache.clean_expired()
    local current_time = get_current_time()
    local removed = 0
    
    for key, entry in pairs(cache_store) do
        if current_time > entry.expires_at then
            cache_store[key] = nil
            removed = removed + 1
        end
    end
    
    return removed
end

-- Cache authentication result
function Cache.cache_auth_result(txn, parsed_data)
    local cookie = txn.sf:req_fhdr("cookie")
    if not cookie or cookie == "" then
        return false
    end
    
    local key = generate_key_from_cookie(cookie)
    if not key then
        return false
    end
    
    -- Store in cache with expiration from config
    local expiration = Config.cache and Config.cache.expiration or DEFAULT_EXPIRATION
    return Cache.set(key, parsed_data, expiration)
end

-- Get cached authentication result
function Cache.get_cached_auth(txn)
    local cookie = txn.sf:req_fhdr("cookie")
    if not cookie or cookie == "" then
        return nil
    end
    
    local key = generate_key_from_cookie(cookie)
    if not key then
        return nil
    end
    
    return Cache.get(key)
end

-- Log cache statistics
function Cache.log_stats(txn)
    txn:Debug("Cache statistics - size: " .. Cache.size() .. ", enabled: " .. tostring(Config.cache.enabled))
    
    local cleaned = Cache.clean_expired()
    if cleaned > 0 then
        txn:Debug("Cleaned " .. cleaned .. " expired cache entries")
    end
end

return Cache
