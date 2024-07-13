import {
  Keypair,
  PublicKey,
  Transaction
} from '@solana/web3.js';
import { useLoginProviderStore } from 'stores/login-provider-store';
import { useConnection } from 'src/composables/useConnection';
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token'
import { useUserStore } from 'stores/user-store';

export const useSignTransaction = async () => {
  const solanaWallet =  useLoginProviderStore().wallet!;
  const connection = await useConnection();
  const privateKey = await solanaWallet.provider.request({
    method: 'solanaPrivateKey'
  });
  const userWalletAddress = useUserStore().user.walletAddress!;
  const ownerPublicKey = new PublicKey(userWalletAddress);

  const clientKeyPair = Keypair.fromSecretKey(Buffer.from(privateKey as string, 'hex'));
  const transaction = new Transaction();

  // Get the token account of the fromWallet address, and if it does not exist, create it
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    clientKeyPair,
    new PublicKey(process.env.USDC_SOLANA_ADDRESS as string),
    ownerPublicKey
  );

  // Get the token account of the toWallet address, and if it does not exist, create it
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    clientKeyPair,
    new PublicKey(process.env.USDC_SOLANA_ADDRESS as string),
    new PublicKey('bPZhuS7BUyC2CWtYyEYXvjUqJn8es3k1aEUft8hXHNQ')
  );

  // Add token transfer instructions to transaction
  const transferInstruction = createTransferInstruction(
    fromTokenAccount.address,
    toTokenAccount.address,
    ownerPublicKey,
    220000
  );
  transaction.add(transferInstruction);

  // Sign the transaction
  transaction.feePayer = ownerPublicKey;
  const blockHash = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockHash.blockhash;

  const signedTx = await solanaWallet.signTransaction(transaction);

  // Serialize the signed transaction
  const serializedTransaction = signedTx.serialize();

  // Convert the serialized transaction to base64
  const base64Transaction = serializedTransaction.toString('base64');
  console.log(base64Transaction);

  // Send this base64Transaction to your backend
  return base64Transaction;
}
