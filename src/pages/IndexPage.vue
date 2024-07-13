<template>
  <q-page class="q-pa-md" :style-fn="() => {}">
    <div class="column full-height">
      <div class="col-auto">
        <div class="text-h4 q-mb-lg text-center">Solana Bridge</div>
        <WalletAddress v-if="walletAddress" :address="walletAddress" class="q-mb-md" />
      </div>
      <div class="col column justify-center">
        <q-card dark class="q-mb-md">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle1">From</div>
              <q-btn-dropdown color="blue-grey-10" label="Solana" icon="img:src/assets/sol.svg" fab-mini dense />
            </div>
            <q-input dark v-model="amount" type="number" filled>
              <template v-slot:append>
                <q-btn-dropdown color="blue-grey-10" :label="sourceToken.name" :icon="sourceToken.img" fab-mini>
                  <q-item clickable v-close-popup @click="findToken('USDC')">
                    <q-item-section avatar class="full-width q-pr-none">
                      <q-item-label class="flex row no-wrap items-center justify-between full-width">
                        <q-img src="~/assets/usdc.svg" width="20px" height="20px" />
                        USDC
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="sourceToken = findToken('Tether')">
                    <q-item-section avatar class="full-width q-pr-none">
                      <q-item-label class="flex row no-wrap items-center justify-between full-width">
                        <q-img src="~/assets/tether.svg" width="20px" height="20px" />
                        Tether
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-btn-dropdown>
              </template>
            </q-input>
          </q-card-section>
        </q-card>
        <q-input
          dark
          filled
          v-model="recipientAddress"
          label="Recipient EVM Address"
          class="q-mb-md"
        />
        <q-card dark class="q-mb-md">
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-subtitle1">To</div>
              <q-btn-dropdown color="blue-grey-10" :label="destChain.name" :icon="destChain.img" fab-mini>
                <q-list>
                  <q-item clickable v-close-popup @click="findChain('Arbitrum')">
                    <q-item-label class="flex row no-wrap items-center justify-between full-width">
                      <q-img src="~/assets/arbitrum.svg" width="20px" height="20px" />
                      Arbitrum
                    </q-item-label>
                  </q-item>

                  <q-item clickable v-close-popup @click="findChain('Polygon')">
                    <q-item-label class="flex row no-wrap items-center justify-between full-width">
                      <q-img src="~/assets/polygon.svg" width="20px" height="20px" />
                      Polygon
                    </q-item-label>
                  </q-item>

                  <q-item clickable v-close-popup @click="findChain('Avalanche')">
                    <q-item-label class="flex row no-wrap items-center justify-between full-width">
                      <q-img src="~/assets/avalanche.svg" width="20px" height="20px" />
                      Avalanche
                    </q-item-label>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row items-center justify-between">
              <div class="text-subtitle1">Dest Token</div>
              <q-btn-dropdown color="blue-grey-10" :label="destToken.name" :icon="destToken.img" fab-mini>
                <q-item clickable v-close-popup @click="findToken('USDC')">
                  <q-item-section avatar class="full-width q-pr-none">
                    <q-item-label class="flex row no-wrap items-center justify-between full-width">
                      <q-img src="~/assets/usdc.svg" width="20px" height="20px" />
                      USDC
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="destToken = findToken('Tether')">
                  <q-item-section avatar class="full-width q-pr-none">
                    <q-item-label class="flex row no-wrap items-center justify-between full-width">
                      <q-img src="~/assets/tether.svg" width="20px" height="20px" />
                      Tether
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-btn-dropdown>
            </div>
          </q-card-section>
        </q-card>

        <div class="text-caption text-right q-mb-lg">~2 minutes</div>
        <q-btn v-if="walletAddress" color="indigo" @click="burn" label="Send" fab-mini />
      </div>
      <div class="col-auto q-mt-auto">
        <q-btn
          v-if="walletAddress"
          color="negative"
          label="Logout"
          class="full-width"
          fab-mini
          @click="logout"
        />
        <q-btn
          v-else
          color="indigo"
          label="Connect wallet"
          class="full-width"
          fab-mini
          @click="login"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'boot/axios';
import { onMounted, ref, toRefs } from 'vue';
import { useFetchBalance } from 'src/composables/useFetchBalance';
import { useSignTransaction } from 'src/composables/useSignTransaction';
import { login } from 'src/composables/useLogin';
import { useUserStore } from 'stores/user-store';
import { useLoginProviderStore } from 'stores/login-provider-store';
import WalletAddress from 'components/WalletAddress.vue';

const amount = ref(0);
const userStore = useUserStore();
const { walletAddress } = toRefs(userStore.user);
const recipientAddress = ref('');

const destChains = ref([
  {
    img: 'img:src/assets/arbitrum.svg',
    name: 'Arbitrum'
  },
  {
    img: 'img:src/assets/polygon.svg',
    name: 'Polygon'
  },
  {
    img: 'img:src/assets/avalanche.svg',
    name: 'Avalanche'
  }
]);
const destChain = ref(destChains.value[0]);

const sourceTokens = ref([{
  img: 'img:src/assets/usdc.svg',
  name: 'USDC'
},
  {
    img: 'img:src/assets/tether.svg',
    name: 'Tether'
  }
]);
const sourceToken = ref(sourceTokens.value[0]);

const destTokens = ref([{
  img: 'img:src/assets/usdc.svg',
  name: 'USDC'
},
  {
    img: 'img:src/assets/tether.svg',
    name: 'Tether'
  }
]);
const destToken = ref(destTokens.value[0]);

const loginProviderStore = useLoginProviderStore();
const { sdk } = toRefs(loginProviderStore);
const burn = async () => {
  const base64Transaction = await useSignTransaction();
  try {
    const res = await api.post('http://localhost:3000/burn_deposit', {
      base64Transaction,
      amount: amount.value,
      recipientAddress: recipientAddress.value,
    }, {});
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const logout = async () => {
  await sdk.value!.logout();
  walletAddress.value = null;
};

const findChain = (name: string) => {
  destChain.value = destChains.value.find((chain) => chain.name === name)!;
};

const findToken = (name: string) => {
  return sourceTokens.value.find(token => {
    return token.name === name;
  })!;
};

onMounted(async () => {
  if (walletAddress.value) {
    console.log((await useFetchBalance('USDC')).balance);
  }
});
</script>

<style scoped lang="scss">

</style>
