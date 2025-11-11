import hmacRequest from "./api";

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

// Mock implementations
const mock = {
  createMerchantUser: async (data: any) => ({
    success: true,
    message: "Merchant user created successfully",
    data: {
      merchant_id: "MOCK_MERCHANT_ID_123",
      ...data,
      id: "MOCK_ID_1",
      is_primary: true,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }),
  getQuote: async ({ merchantId, chain, token, amount }: any) => ({
    success: true,
    message: "Quote generated",
    data: {
      quote_id: "MOCK_QUOTE_ID_1",
      merchant_id: merchantId,
      chain,
      token,
      amount,
      address: "0xMOCKADDRESS123",
      expires_at: new Date(Date.now() + 600000).toISOString()
    }
  }),
  initiateDeposit: async ({ quoteId }: any) => ({
    success: true,
    message: "Deposit initiated",
    data: {
      deposit_id: "MOCK_DEPOSIT_ID_1",
      quote_id: quoteId,
      status: "pending",
      created_at: new Date().toISOString()
    }
  }),
  getWallets: async ({ clientId }: any) => ({
    success: true,
    message: "Wallets fetched",
    data: {
      wallets: [
        {
          chain: "Ethereum",
          tokens: [
            {
              symbol: "ETH",
              deposit_address: "0xMOCKETHADDRESS"
            },
            {
              symbol: "USDT",
              deposit_address: "0xMOCKUSDTADDRESS_ETH"
            }
          ]
        },
        {
          chain: "Polygon",
          tokens: [
            {
              symbol: "MATIC",
              deposit_address: "0xMOCKMATICADDRESS"
            },
            {
              symbol: "USDT",
              deposit_address: "0xMOCKUSDTADDRESS_POLYGON"
            }
          ]
        },
        {
          chain: "Tron",
          tokens: [
            {
              symbol: "TRX",
              deposit_address: "TMOCKTRXADDRESS"
            },
            {
              symbol: "USDT",
              deposit_address: "TMOCKUSDTADDRESS_TRON"
            }
          ]
        }
      ]
    }
  }),
  getClientDetails: async ({ clientId }: any) => ({
    success: true,
    message: "Client details fetched",
    data: {
      id: clientId,
      email: "mockuser@example.com",
      first_name: "Mock",
      last_name: "User",
      phone: "+1234567890",
      contact_type: "admin",
      title: "Manager",
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  })
};

// Real API implementations
const real = {
  createMerchantUser: async (data: any) => {
    try {
      // Only send the required payload fields
      const payload = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      };
      const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
      return await hmacRequest({
        method: "POST",
        path: `/api/v1/merchants/${merchantId}/clients`,
        body: payload
      });
    } catch (err: any) {
      console.error("Error in createMerchantUser:", err);
      return { success: false, message: err.message || "Network error" };
    }
  },
  getQuote: async (params: any) => {
    try {
      return await hmacRequest({
        method: "POST",
        path: "/api/v1/quote",
        body: params
      });
    } catch (err: any) {
      console.error("Error in getQuote:", err);
      return { success: false, message: err.message || "Network error" };
    }
  },
  initiateDeposit: async (params: any) => {
    try {
      return await hmacRequest({
        method: "POST",
        path: "/api/deposit",
        body: params
      });
    } catch (err: any) {
      console.error("Error in initiateDeposit:", err);
      return { success: false, message: err.message || "Network error" };
    }
  },
  getWallets: async ({ clientId }: { clientId: string }) => {
    try {
      return await hmacRequest({
        method: "GET",
        path: `/api/v1/wallets?client_id=${clientId}`
      });
    } catch (err: any) {
      console.error("Error in getWallets:", err);
      return { success: false, message: err.message || "Network error" };
    }
  },
  getClientDetails: async ({ clientId }: { clientId: string }) => {
    const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID;
    try {
      return await hmacRequest({
        method: "GET",
        path: `/api/v1/merchants/${merchantId}/clients/${clientId}`
      });
    } catch (err: any) {
      console.error("Error in getClientDetails:", err);
      return { success: false, message: err.message || "Network error" };
    }
  }
};

export const createMerchantUser = useMock ? mock.createMerchantUser : real.createMerchantUser;
export const getQuote = useMock ? mock.getQuote : real.getQuote;
export const initiateDeposit = useMock ? mock.initiateDeposit : real.initiateDeposit;
export const getWallets = useMock ? mock.getWallets : real.getWallets;
export const getClientDetails = useMock ? mock.getClientDetails : real.getClientDetails;
