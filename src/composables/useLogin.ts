import { useWeb3Auth } from 'src/composables/useWeb3Auth';
import { SolanaWallet } from '@web3auth/solana-provider';
import { markRaw } from 'vue';
import type { Web3Auth } from '@web3auth/modal';
import { useUserStore } from 'stores/user-store';
import { useLoginProviderStore } from 'stores/login-provider-store';

let web3Auth: Web3Auth | undefined = undefined;
const userStore = useUserStore();
const loginProviderStore = useLoginProviderStore();

export const login = async () => {
  web3Auth = await useWeb3Auth()
  if(web3Auth) {
    const provider = await web3Auth.connect()
    const wallet = new SolanaWallet(provider!);
    const [firstAccount] = await wallet.requestAccounts();

    loginProviderStore.sdk = markRaw(web3Auth);
    loginProviderStore.wallet = markRaw(wallet);
    userStore.user.walletAddress = firstAccount;
  }
}
