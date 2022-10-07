// Importing libraries
import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { createWriteStream } from 'fs';
import 'dotenv/config';
import { Alchemy, Network } from 'alchemy-sdk';
import { constants } from 'ethers';

const settings = {
  apiKey: 'demo', // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

// Instantiate thirdweb SDK
const sdk = new ThirdwebSDK('ethereum');

const contractAddress = '0x650244F4949F14AA49BE93D144125c7139E04552'; // Replace with your contract address

const signatureDrop = await sdk.getSignatureDrop(contractAddress);

const getBalances = async () => {
  const addresses = (
    await alchemy.nft.getOwnersForContract(contractAddress)
  ).owners.filter((addr) => addr !== constants.AddressZero);
  const balances: { address: string; quantity: string }[] = [];
  const writeStream = createWriteStream('output.json');
  writeStream.write('[' + '\n');
  try {
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      const balanceOf = await signatureDrop.balanceOf(address);
      const objectToPush = { address, quantity: balanceOf.toString() };
      balances.push(objectToPush);

      writeStream.write(
        JSON.stringify(objectToPush) +
          (i === addresses.length - 1 ? '\n' : ',\n'),
      );
    }
  } catch (error) {
    console.log(error);
  }

  writeStream.write(']' + '\n');
  writeStream.end();
  console.log("Output written to 'output.json'");

  return balances;
};

getBalances();

