import React, { useState } from 'react';
import { getQuote } from '../lib/services';

const CHAINS = [
  { label: 'Ethereum', value: 'ethereum' },
  { label: 'Tron', value: 'tron' }
];

type ChainType = 'ethereum' | 'tron';
type TokenType = 'ETH' | 'USDT' | 'USDC' | 'TRX';

type TokenOption = { label: string; value: TokenType };

type TokensByChainType = {
  [key in ChainType]: TokenOption[];
};

const TOKENS_BY_CHAIN: TokensByChainType = {
  ethereum: [
    { label: 'ETH', value: 'ETH' },
    { label: 'USDT', value: 'USDT' },
    { label: 'USDC', value: 'USDC' }
  ],
  tron: [
    { label: 'TRX', value: 'TRX' },
    { label: 'USDT', value: 'USDT' },
    { label: 'USDC', value: 'USDC' }
  ]
};

type DepositFormProps = {
  merchantId: string;
};

function DepositForm({ merchantId }: DepositFormProps) {
  const [chain, setChain] = useState<ChainType>(CHAINS[0].value as ChainType);
  const [token, setToken] = useState<TokenType>(
    TOKENS_BY_CHAIN[CHAINS[0].value as ChainType][0].value
  );
  const [amount, setAmount] = useState<string>('');
  const [quote, setQuote] = useState<any>(null); // Replace 'any' with a specific type if available
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChain = e.target.value as ChainType;
    setChain(selectedChain);
    setToken(TOKENS_BY_CHAIN[selectedChain][0].value);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setToken(e.target.value as TokenType);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuote(null);
    try {
      const data = await getQuote({ merchantId, chain, token, amount });
      setQuote(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err && 'message' in err) {
        setError((err as any).message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-500-to-tr from-indigo-100 via-blue-50 to-white flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white backdrop-blur-md bg-opacity-70 rounded-3xl shadow-xl border border-indigo-200 p-8 sm:p-12 flex flex-col gap-8 font-sans"
      >
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Deposit Crypto</h1>
          <p className="text-indigo-600/80 text-lg max-w-md mx-auto">
            Select your blockchain, token, and enter the amount to get a live quote.
          </p>
        </header>

        {/* Chain selector */}
        <div className="flex flex-col">
          <label htmlFor="chain" className="mb-2 font-semibold text-indigo-800">
            Blockchain Chain
          </label>
          <select
            id="chain"
            value={chain}
            onChange={handleChainChange}
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-300 text-indigo-900 transition-shadow shadow-sm hover:shadow-md"
          >
            {CHAINS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Token selector */}
        <div className="flex flex-col">
          <label htmlFor="token" className="mb-2 font-semibold text-indigo-800">
            Token
          </label>
          <select
            id="token"
            value={token}
            onChange={handleTokenChange}
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-300 text-indigo-900 transition-shadow shadow-sm hover:shadow-md"
          >
            {TOKENS_BY_CHAIN[chain].map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount input */}
        <div className="flex flex-col">
          <label htmlFor="amount" className="mb-2 font-semibold text-indigo-800">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            required
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow shadow-sm hover:shadow-md"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-xl font-bold shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? <span className="animate-pulse">Loading...</span> : 'Get Quote'}
        </button>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-center font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* Quote result */}
        {quote && (
          <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-300 rounded-2xl p-6 shadow-md overflow-auto text-indigo-900">
            <h3 className="text-2xl font-semibold mb-4">Quote Result</h3>
            <pre className="whitespace-pre-wrap break-words text-sm bg-white rounded-lg p-4 border border-indigo-100 overflow-x-auto">
              {JSON.stringify(quote, null, 2)}
            </pre>
          </section>
        )}
      </form>
    </div>
  );
}

export default DepositForm;
