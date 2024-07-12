import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, CustomChainConfig, WEB3AUTH_NETWORK } from '@web3auth/base';
import { SolanaPrivateKeyProvider } from '@web3auth/solana-provider';
import { useErrorHandler } from 'src/composables/useErrorHandler';

export const useWeb3Auth = async () => {
  console.log(process.env.RPC_TARGET);
  console.log(process.env.MODE);
  const chainConfig: CustomChainConfig = {
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    chainId: '0x3',
    rpcTarget: process.env.RPC_TARGET as string,
    displayName: 'Solana Devnet',
    blockExplorerUrl: 'https://explorer.solana.com/',
    ticker: 'SOL',
    tickerName: 'Solana',
    isTestnet: true,
  };

  const privateKeyProvider = new SolanaPrivateKeyProvider({
    config: { chainConfig },
  });

  const web3auth = new Web3Auth({
    clientId: process.env.WEB3AUTH_CLIENT_ID as string,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chainConfig,
    privateKeyProvider,
  });

  try {
    await web3auth.initModal();
    return web3auth;
  } catch (e) {
    if (e instanceof Error) {
      useErrorHandler(e);
    } else {
      console.error(e);
    }
  }
};
