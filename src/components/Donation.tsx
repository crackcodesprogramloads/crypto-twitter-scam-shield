import { useState } from 'react';

function Donation() {
  const [donateIsOpen, setDonateIsOpen] = useState(false);

  return (
    <>
      <button
        className="p-0 m-0 text-gray-300 text-md hover:text-gray-100"
        onClick={() => setDonateIsOpen(!donateIsOpen)}
      >
        Buy me a coffee ☕
      </button>
      {donateIsOpen ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-200 text-md">
            Metamask - EVM compatible chains
          </p>
          <p className="text-gray-200 text-md">
            0xCF9706706aD4B3c65A1cdF95563eDe5BC84ed88d
          </p>
        </div>
      ) : null}
    </>
  );
}

export default Donation;
