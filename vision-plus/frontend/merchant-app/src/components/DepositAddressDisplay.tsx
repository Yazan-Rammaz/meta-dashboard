import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface DepositAddressDisplayProps {
  depositAddress: string;
  amount?: string | number;
  token: string;
  chain: string;
}

function DepositAddressDisplay({
  depositAddress,
  amount,
  token,
  chain
}: DepositAddressDisplayProps) {
  if (!depositAddress) return null;
  return (
    <div className="w-full max-w-lg bg-white bg-opacity-80 rounded-3xl shadow-xl border border-indigo-200 p-8 flex flex-col gap-6 font-sans mx-auto mt-8 items-center">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Deposit Address</h2>
      <div className="flex flex-col items-center gap-2 mb-4 text-indigo-900">
        <div>
          <span className="font-semibold">Chain:</span> {chain}
        </div>
        <div>
          <span className="font-semibold">Token:</span> {token}
        </div>
        {amount && (
          <div>
            <span className="font-semibold">Amount:</span> {amount}
          </div>
        )}
      </div>
      <div className="qr-address break-all mb-4 text-indigo-900">{depositAddress}</div>
      <QRCodeSVG value={depositAddress} size={320} />
      <div className="qr-instruction mt-4 text-indigo-700">Scan this QR code to deposit funds</div>
    </div>
  );
}

export default DepositAddressDisplay;
