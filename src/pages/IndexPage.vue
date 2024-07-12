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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useTransfer } from 'src/composables/useTransfer';
import { useFetchBalance } from 'src/composables/useFetchBalance';
import { onMounted } from 'vue';

onMounted(async () => {
  useTransfer()
  console.log((await useFetchBalance('USDC')).balance)
})
</script>

<style scoped lang="scss">

</style>
