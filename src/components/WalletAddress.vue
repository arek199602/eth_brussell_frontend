<template>
  <div class="wallet-address-component">
    <q-card flat bordered class="q-pa-sm">
      <div class="row items-center justify-between">
        <div class="text-subtitle1">Wallet Address:</div>
        <q-btn
          flat
          round
          color="primary"
          icon="content_copy"
          @click="copyToClipboard"
        >
          <q-tooltip>Copy address</q-tooltip>
        </q-btn>
      </div>
      <div class="text-body2 q-mt-sm">{{ truncatedAddress }}</div>
    </q-card>
    <q-dialog v-model="showNotification">
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Address copied to clipboard!</span>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  address: string
}

const props = defineProps<Props>()

const showNotification = ref(false)

const truncatedAddress = computed(() => {
  if (props.address.length > 10) {
    return `${props.address.slice(0, 30)}...${props.address.slice(-4)}`
  }
  return props.address
})

const copyToClipboard = () => {
  navigator.clipboard.writeText(props.address).then(() => {
    showNotification.value = true
    setTimeout(() => {
      showNotification.value = false
    }, 2000)
  })
}
</script>
