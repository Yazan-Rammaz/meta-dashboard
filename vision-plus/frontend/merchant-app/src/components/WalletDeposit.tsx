import React, { useEffect, useState } from "react";
import { getWallets } from "../lib/services";

// Types for wallet and token
interface Token {
  symbol: string;
  deposit_address: string;
}

interface Wallet {
  chain: string;
  tokens: Token[];
}

interface WalletDepositProps {
  clientId: string;
  onDepositAddress?: (address: string) => void;
  depositAddress?: string;
  onChainChange?: (chain: string) => void;
  onTokenChange?: (token: string) => void;
  onAmountChange?: (amount: string) => void;
}

const WalletDeposit: React.FC<WalletDepositProps> = ({
  clientId,
  onDepositAddress,
  depositAddress,
  onChainChange,
  onTokenChange,
  onAmountChange
}) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    getWallets({ clientId })
      .then((data: any) => {
        // Support new API response: data.items[].assets[]
        let parsedWallets: Wallet[] = [];
        if (data && data.status === "success" && data.data && Array.isArray(data.data.items)) {
          // Group assets by chain
          const chainMap: { [chain: string]: Token[] } = {};
          data.data.items.forEach((wallet: any) => {
            if (Array.isArray(wallet.assets)) {
              wallet.assets.forEach((asset: any) => {
                if (asset.address && asset.address !== "Not generated") {
                  if (!chainMap[asset.chain]) chainMap[asset.chain] = [];
                  chainMap[asset.chain].push({
                    symbol: asset.symbol,
                    deposit_address: asset.address
                  });
                }
              });
            }
          });
          parsedWallets = Object.entries(chainMap).map(([chain, tokens]) => ({ chain, tokens }));
        } else if (data && data.success && data.data && data.data.wallets) {
          // Legacy mock format
          parsedWallets = data.data.wallets;
        }
        setWallets(parsedWallets);
        if (parsedWallets.length > 0) {
          setSelectedChain(parsedWallets[0].chain);
          setSelectedToken(parsedWallets[0].tokens[0]?.symbol || "");
          if (onChainChange) onChainChange(parsedWallets[0].chain);
          if (onTokenChange) onTokenChange(parsedWallets[0].tokens[0]?.symbol || "");
        } else {
          setError("No wallets found");
        }
      })
      .catch(() => setError("Failed to fetch wallets"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [clientId]);

  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChain(e.target.value);
    if (onChainChange) onChainChange(e.target.value);
    const wallet = wallets.find((w) => w.chain === e.target.value);
    const firstToken = wallet?.tokens[0]?.symbol || "";
    setSelectedToken(firstToken);
    if (onTokenChange) onTokenChange(firstToken);
    if (onDepositAddress) onDepositAddress(""); // Reset address on change
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(e.target.value);
    if (onTokenChange) onTokenChange(e.target.value);
    if (onDepositAddress) onDepositAddress(""); // Reset address on change
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (onAmountChange) onAmountChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const wallet = wallets.find((w) => w.chain === selectedChain);
    const token = wallet?.tokens.find((t) => t.symbol === selectedToken);
    if (onDepositAddress) onDepositAddress(token?.deposit_address || "");
  };

  // Remove wallets from select options, use hardcoded
  // Only show the form if depositAddress is not set
  if (depositAddress) return null;

  return (
    <div className="w-full max-w-lg bg-white bg-opacity-80 rounded-3xl shadow-xl border border-indigo-200 p-8 flex flex-col gap-8 font-sans mx-auto mt-8">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Deposit to Wallet</h2>
      {loading && (
        <div className="flex items-center justify-center gap-4 py-6">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-indigo-200 rounded-full animate-spin"></div>
        </div>
      )}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-4">
            <label className="mb-2 font-semibold text-indigo-800">Chain</label>
            <select
              value={selectedChain}
              onChange={handleChainChange}
              className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900"
            >
              {wallets.map((w) => (
                <option key={w.chain} value={w.chain}>
                  {w.chain}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2 font-semibold text-indigo-800">Token</label>
            <select
              value={selectedToken}
              onChange={handleTokenChange}
              className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900"
            >
              {Array.from(
                new Set(wallets.find((w) => w.chain === selectedChain)?.tokens.map((t) => t.symbol))
              ).map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2 font-semibold text-indigo-800">Amount</label>
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={handleAmountChange}
              className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900"
              placeholder="Enter amount (optional)"
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors"
            >
              Show Deposit QR
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WalletDeposit;
