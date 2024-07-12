import { defineStore } from 'pinia';

interface State {
  user: {
    walletAddress: string | null;
  }
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      user: {
        walletAddress: null,
      },
    };
  },
});
