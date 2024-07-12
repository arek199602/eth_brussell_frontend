import { ref } from 'vue';
import { useErrorHandler } from 'src/composables/useErrorHandler';
import { useUserStore } from 'stores/user-store';
import {  PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection } from 'src/composables/useConnection';

/**
 * Fetches the balance of a wallet using the provided SDK.
 *
 * @returns {Promise<Balance>} - A promise that resolves to an object containing the wallet balance.
 */

interface Balance {
  balance: number;
}

export const useFetchBalance = async (token: string | null = null): Promise<Balance> => {
  const balance = ref(0);
  const userWalletAddress = useUserStore().user.walletAddress!;

  const connection = await useConnection();

  const _fetchWalletBalance = async () => {
    if (token) {
      let totalUSDC = 0;
      const usdcMintAddress = new PublicKey(process.env.USDC_SOLANA_ADDRESS as string);
      const ownerPublicKey = new PublicKey(userWalletAddress);
      const token = await connection.getTokenAccountsByOwner(ownerPublicKey, {
        mint: usdcMintAddress,
      })
      console.log('dsda: ', token.value[0].pubkey.toString());
      const accounts = await connection.getParsedTokenAccountsByOwner(ownerPublicKey, {
        mint: usdcMintAddress,
      });
      console.log('Accounts: ', accounts.value[0].pubkey.toString(), ownerPublicKey.toString());
      accounts.value.forEach((account) => {
        const usdcAmount = account.account.data.parsed.info.tokenAmount.uiAmount;
        totalUSDC += usdcAmount;
      });
      return totalUSDC;
    } else {
      return (await connection.getBalance(new PublicKey(userWalletAddress))) / LAMPORTS_PER_SOL;
    }
  };

  try {
    balance.value = await _fetchWalletBalance();
  } catch (e) {
    useErrorHandler(e as Error);
  }

  return { balance: balance.value };
};
