import CryptoJS from 'crypto-js';

const apiKey = process.env.NEXT_PUBLIC_VISIONPAY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_VISIONPAY_API_SECRET;

// Use proxy (relative path) in Docker/HAProxy, direct URL only if explicitly set
let baseUrl = '';

type HmacRequestParams = {
  method: string;
  path: string;
  queryString?: string;
  body?: any;
};

function generateSignature(
  method: string,
  path: string,
  queryString: string,
  timestamp: string,
  body = ''
): string {
  if (!apiSecret) throw new Error('API secret is not defined');
  const stringToSign = `${method}\n${path}\n${queryString}\n${timestamp}\n${body}`;
  const hexString = apiSecret.replace('hex_', '');
  const keyBytes = CryptoJS.enc.Hex.parse(hexString);
  const signature = CryptoJS.HmacSHA256(stringToSign, keyBytes);
  return signature.toString(CryptoJS.enc.Hex);
}

async function hmacRequest({
  method,
  path,
  queryString = '',
  body
}: HmacRequestParams): Promise<any> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyString = body ? JSON.stringify(body) : '';
  const signature = generateSignature(method, path, queryString, timestamp, bodyString);

  const headers: Record<string, string | undefined> = {
    'X-API-Key': apiKey,
    'X-API-Signature': signature,
    'X-API-Timestamp': timestamp,
    'Content-Type': 'application/json'
  };

  const url = `${baseUrl}${path}${queryString ? `?${queryString}` : ''}`;

  const fetchOptions: RequestInit = {
    method,
    headers: headers as Record<string, string>
  };
  if (body) (fetchOptions as any).body = bodyString;

  const res = await fetch(url, fetchOptions);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${res.status}`);
  }
  return res.json();
}

type RequestConfig = {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
};

type ApiType = {
  request: (config: RequestConfig) => Promise<any>;
  get: (url: string, params?: any, headers?: Record<string, string>) => Promise<any>;
  post: (url: string, data?: any, headers?: Record<string, string>) => Promise<any>;
  put: (url: string, data?: any, headers?: Record<string, string>) => Promise<any>;
  patch: (url: string, data?: any, headers?: Record<string, string>) => Promise<any>;
  delete: (url: string, headers?: Record<string, string>) => Promise<any>;
};

const api: ApiType = {
  async request({ url, method, data, params, headers }: RequestConfig) {
    const defaultHeaders: Record<string, string> = {};

    // Only set Content-Type if not provided in headers and data is not FormData
    if (!headers?.['Content-Type'] && !(data instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const response = await fetch(`${url}${queryString}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: data instanceof FormData ? data : data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      if (response?.status === 401) {
        // window.location.href = "/";
      }

      // Try to get error details from the response
      const text = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (jsonError) {
        // If we can't parse the JSON, just throw a basic error
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      throw {
        status: response.status,
        message: errorData.message || errorData?.error || `HTTP error! status: ${response.status}`,
        data: errorData
      };
    }

    // Check if there's any content to parse
    const text = await response.text();
    if (!text) {
      return null;
    }

    return JSON.parse(text);
  },

  get: (url: string, params?: any, headers?: Record<string, string>) =>
    api.request({ url, method: 'GET', params, headers }),
  post: (url: string, data?: any, headers?: Record<string, string>) =>
    api.request({ url, method: 'POST', data, headers }),
  put: (url: string, data?: any, headers?: Record<string, string>) =>
    api.request({ url, method: 'PUT', data, headers }),
  patch: (url: string, data?: any, headers?: Record<string, string>) =>
    api.request({ url, method: 'PATCH', data, headers }),
  delete: (url: string, headers?: Record<string, string>) =>
    api.request({ url, method: 'DELETE', headers })
};

export { api };
export default hmacRequest;
