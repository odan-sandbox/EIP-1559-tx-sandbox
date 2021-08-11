import dotenv from "dotenv";
import { ethers, Wallet } from "ethers";

dotenv.config();

async function sendLegacyTx(wallet: Wallet) {
  return wallet.sendTransaction({
    to: wallet.address,
    type: 0,
  });
}

async function sendEIP1559Tx(wallet: Wallet) {
  return wallet.sendTransaction({
    to: wallet.address,
    // type が undefined だと 2 (EIP-1559) としてトランザクションが作成される
    // type: 2,
  });
}

async function main() {
  const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!INFURA_PROJECT_ID || !PRIVATE_KEY) {
    return;
  }

  const provider = ethers.getDefaultProvider("rinkeby", {
    infura: INFURA_PROJECT_ID,
  });

  const wallet = new Wallet(PRIVATE_KEY).connect(provider);

  const legacyTx = await sendLegacyTx(wallet);
  console.log((await legacyTx.wait()).transactionHash);

  const eip1559Tx = await sendEIP1559Tx(wallet);
  console.log((await eip1559Tx.wait()).transactionHash);
}

main();
