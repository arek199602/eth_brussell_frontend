<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
          :duration="200"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'stores/user-store';

const userStore = useUserStore();
const router = useRouter();

watch(
  () => userStore.user.walletAddress,
  () => {
    if (!userStore.user.walletAddress) {
      router.push('/');
    }
  },
);
</script>

<style scoped lang="scss">
.q-page {
  height: 100dvh;
}
</style>
