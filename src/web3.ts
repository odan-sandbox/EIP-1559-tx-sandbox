import dotenv from "dotenv";
import Web3 from "web3";
import { Account } from "web3-core";

dotenv.config();

async function sendLegacyTx(web3: Web3, account: Account) {
  const from = account.address;
  const to = account.address;
  const tx = await web3.eth.sendTransaction({
    from,
    to,
    gas: "21000",
  });

  return tx;
}

async function sendEIP1559Tx(web3: Web3, account: Account) {
  const from = account.address;
  const to = account.address;
  // sendTransaction の型定義が EIP-1559 に対応していないので as any 必須
  const tx = await web3.eth.sendTransaction({
    from,
    to,
    type: "0x2",
    gas: "21000",
  } as any);

  return tx;
}

async function main() {
  const RPC_URL = process.env.RPC_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!RPC_URL || !PRIVATE_KEY) {
    return;
  }

  const web3 = new Web3(RPC_URL);

  const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
  web3.eth.accounts.wallet.add(account);

  const legacyTx = await sendLegacyTx(web3, account);
  console.log(legacyTx.transactionHash);

  const eip1559Tx = await sendEIP1559Tx(web3, account);
  console.log(eip1559Tx.transactionHash);
}

main();
