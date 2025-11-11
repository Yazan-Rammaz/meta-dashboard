"use client";
import React, { useState } from "react";
import MerchantUserForm from "./MerchantUserForm";
import WalletDeposit from "./WalletDeposit";
import DepositAddressDisplay from "./DepositAddressDisplay";
import { getClientDetails } from "../lib/services";

interface ClientDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  contact_type: string;
  title: string;
  status: string;
  [key: string]: any;
}

const ClientWalletFlow: React.FC = () => {
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState<boolean>(false);
  const [depositAddress, setDepositAddress] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  // Handler to update chain/token from WalletDeposit
  const handleChainChange = (chain: string) => setSelectedChain(chain);
  const handleTokenChange = (token: string) => setSelectedToken(token);
  const handleAmountChange = (amt: string) => setAmount(amt);

  // Fetch client details when clientId is set
  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    getClientDetails({ clientId })
      .then((data: any) => {
        if (data && data.success && data.data) {
          setClientDetails(data.data);
        } else {
          setError("Failed to fetch client details");
        }
      })
      .catch(() => setError("Failed to fetch client details"))
      .finally(() => setLoading(false));
  }, [clientId]);

  if (!clientId) {
    return <MerchantUserForm onUserCreated={setClientId} />;
  }

  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  // Show deposit UI
  return (
    <>
      <WalletDeposit
        clientId={clientId}
        onDepositAddress={setDepositAddress}
        depositAddress={depositAddress}
        onChainChange={handleChainChange}
        onTokenChange={handleTokenChange}
        onAmountChange={handleAmountChange}
      />
      <DepositAddressDisplay
        depositAddress={depositAddress}
        amount={amount}
        token={selectedToken}
        chain={selectedChain}
      />
    </>
  );
};

export default ClientWalletFlow;
