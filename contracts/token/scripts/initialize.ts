/* eslint-disable @typescript-eslint/ban-ts-comment */
const { Signer, Provider, Contract } = require('koilib');
const path = require('path');
const { fileURLToPath } = require('url');
const fs = require('fs');
const otcAbi = require('../abi/token-abi.json');
const dotenv = require('dotenv');
dotenv.config();

let [networkName] = process.argv.slice(2);

const abi = {
  ...otcAbi,
  koilib_types: otcAbi.types
};

(async () => {
  networkName = networkName || 'HARBINGER';
  const contractPrivateKey = process.env[`${networkName}_CONTRACT_PRIVATE_KEY`] as string;
  const jsonRPCUrl = process.env[`${networkName}_JSON_RPC_URL`] as string;
  const owner = process.env[`${networkName}_OWNER_ADDRESS`] as string;
  const name = process.env[`${networkName}_TOKEN_NAME`] as string;
  const symbol = process.env[`${networkName}_TOKEN_SYMBOL`] as string;
  const decimals = process.env[`${networkName}_TOKEN_DECIMALS`] as string;
  const max_supply = process.env[`${networkName}_TOKEN_MAX_SUPPLY`] as string;

  // deploy contract
  const provider = new Provider(jsonRPCUrl);
  const signer = Signer.fromWif(contractPrivateKey);
  signer.provider = provider;

  const contract = new Contract({
    id: signer.address,
    // @ts-ignore abi is compatible
    abi,
    provider,
    signer
  });

  const { receipt, transaction } = await contract.functions.initialize({
    owner,
    name,
    symbol,
    max_supply,
    decimals: parseInt(decimals)
  });

  console.log('The contract is being initialized. Transaction receipt:');
  console.log(receipt);

  const { blockNumber } = await transaction!.wait('byBlock', 60000);

  console.log(`Contract successfully initialized. Transction included i block ${blockNumber}`);
})();