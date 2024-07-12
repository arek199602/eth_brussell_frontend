import { defineStore } from 'pinia';
import type { Web3Auth } from '@web3auth/modal';
import type { SolanaWallet } from '@web3auth/solana-provider';

interface loginProviderStore {
  sdk: Web3Auth | null;
  wallet: SolanaWallet | null;
}

export const useLoginProviderStore = defineStore('loginProvider', {
  state: (): loginProviderStore => ({
    sdk: null,
    wallet: null,
  }),
});
