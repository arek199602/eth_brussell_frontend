<template>
  <q-page
    id="index-page"
    class="q-pa-md"
    :style-fn="() => {}"
  >
    <div class="column items-center">
      <div class="col">
      </div>
      <div class="col">
        <h3>Welcome</h3>
      </div>
      <div class="col">
        <q-btn @click="burn">
          Burn
        </q-btn>
        <q-btn @click="useSignTransaction">
          Sign Transaction
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'boot/axios';
import { useFetchBalance } from 'src/composables/useFetchBalance';
import { onMounted } from 'vue';
import { useSignTransaction } from 'src/composables/useSignTransaction';

onMounted(async () => {
  console.log((await useFetchBalance('USDC')).balance)
})

const burn = async () => {
  const base64Transaction = await useSignTransaction()
  try {
    const res = await api.post('http://localhost:3000/burn_deposit', {
      base64Transaction
    }, {});
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped lang="scss">

</style>
