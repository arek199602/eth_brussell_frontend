<template>
  <q-page
    id="index-page"
    :class="['column justify-center items-center']"
    :style-fn="() => {}"
  >
    <h4 class="q-ma-none q-mb-md">Cross chain transfer</h4>
    <q-btn @click="login">Login</q-btn>
  </q-page>
</template>

<script setup lang="ts">
import { useWeb3Auth } from 'src/composables/useWeb3Auth';
import { useRouter } from 'vue-router';
import { useUserStore } from 'stores/user-store';
import { useLoginProviderStore } from 'stores/login-provider-store';
import type { Web3Auth } from '@web3auth/modal';
import { SolanaWallet } from '@web3auth/solana-provider';
import { markRaw } from 'vue';

let web3Auth: Web3Auth | undefined = undefined;
const userStore = useUserStore();
const loginProviderStore = useLoginProviderStore();
const router = useRouter();

const login = async () => {
  web3Auth = await useWeb3Auth()
  if(web3Auth) {
    const provider = await web3Auth.connect()
    const wallet = new SolanaWallet(provider!);
    const [firstAccount] = await wallet.requestAccounts();

    loginProviderStore.sdk = markRaw(web3Auth);
    loginProviderStore.wallet = markRaw(wallet);
    userStore.user.walletAddress = firstAccount;
    await router.push('/');
  }
}
</script>

<style lang="scss" scoped>

</style>
