import { useLoginProviderStore } from 'stores/login-provider-store';
import type { CustomChainConfig } from '@web3auth/base';
import { Connection } from '@solana/web3.js';

export const useConnection = async () => {
  const wallet = useLoginProviderStore().wallet!;

  const connectionConfig = (await wallet.request({
    method: 'solana_provider_config',
    params: [],
  })) as CustomChainConfig;
  return new Connection(connectionConfig.rpcTarget);
}
