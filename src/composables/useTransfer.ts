// import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, Keypair } from '@solana/web3.js'
// import { ethers } from 'ethers'
import { useLoginProviderStore } from 'stores/login-provider-store';
import { useConnection } from 'src/composables/useConnection';
import { SolanaWallet } from '@web3auth/solana-provider';


export const useTransfer = async () => {
  const loginProvider = useLoginProviderStore();

  const getPrivateKey = async () => {
    return await loginProvider.wallet!.provider.request({
      method: 'solanaPrivateKey'
    });
  }

  const connection = await useConnection();
  const wallet = new SolanaWallet(loginProvider.wallet!.provider);
  console.log(await getPrivateKey(), connection, wallet);

}
// Assuming user is already logged in.

// Test network private keys (never use these on mainnet!)
// const SOLANA_PRIVATE_KEY = 'your_solana_testnet_private_key';
// const ARBITRUM_PRIVATE_KEY = 'your_arbitrum_testnet_private_key';
// const CIRCLE_SANDBOX_API_KEY = 'your_circle_sandbox_api_key';
//
// async function transferUSDCFromSolanaToArbitrum(amount, fromSolanaAddress, toArbitrumAddress) {
//   try {
//     // Solana testnet setup
//     const solanaConnection = new Connection('https://api.testnet.solana.com');
//     const solanaWallet = Keypair.fromSecretKey(Buffer.from(SOLANA_PRIVATE_KEY, 'hex'));
//
//     // Arbitrum testnet (Goerli) setup
//     const arbitrumProvider = new ethers.providers.JsonRpcProvider('https://goerli-rollup.arbitrum.io/rpc');
//     const arbitrumWallet = new ethers.Wallet(ARBITRUM_PRIVATE_KEY, arbitrumProvider);
//
//     // 1. Initiate transfer on Solana testnet
//     const burnInstruction = await getBurnInstruction(solanaConnection, solanaWallet.publicKey, amount);
//     const transaction = new Transaction().add(burnInstruction);
//     const signature = await sendAndConfirmTransaction(solanaConnection, transaction, [solanaWallet]);
//     console.log('Burn transaction signature:', signature);
//
//     // 2. Get attestation from Circle sandbox
//     const attestation = await getAttestation(signature);
//
//     // 3. Mint on Arbitrum testnet
//     const mintTx = await mintOnArbitrum(arbitrumWallet, toArbitrumAddress, amount, attestation);
//     console.log('Mint transaction hash:', mintTx.hash);
//
//     await mintTx.wait();
//     console.log('Transfer completed');
//
//   } catch (error) {
//     console.error('Error during transfer:', error);
//     throw error;
//   }
// }
//
// async function getBurnInstruction(connection, fromPubkey, amount) {
//   // Implement testnet USDC burn instruction
//   // This would interact with the testnet USDC program on Solana
// }
//
// async function getAttestation(burnSignature) {
//   const response = await axios.post('https://api-sandbox.circle.com/v1/attestations', {
//     burnTransaction: burnSignature
//   }, {
//     headers: { 'Authorization': `Bearer ${CIRCLE_SANDBOX_API_KEY}` }
//   });
//   return response.data.attestation;
// }
//
// async function mintOnArbitrum(wallet, toAddress, amount, attestation) {
//   // Interact with the Arbitrum testnet USDC contract
//   const USDC_CONTRACT_ADDRESS = '0xTestnetUSDCContractAddress';
//   const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, wallet);
//   return await usdcContract.mint(toAddress, amount, attestation);
// }
//
// // Usage
// const amount = '100000000'; // 100 USDC (assuming 6 decimal places)
// const fromSolanaAddress = 'YourSolanaTestnetAddress';
// const toArbitrumAddress = '0xYourArbitrumTestnetAddress';
//
// transferUSDCFromSolanaToArbitrum(amount, fromSolanaAddress, toArbitrumAddress)
//   .then(() => console.log('Transfer successful'))
//   .catch(error => console.error('Transfer failed:', error));
