import { getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [avalanche, avalancheFuji],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.id === avalanche.id 
          ? 'https://api.avax.network/ext/bc/C/rpc'
          : 'https://api.avax-test.network/ext/bc/C/rpc',
      }),
    }),
    publicProvider(),
  ]
);

const { wallets } = getDefaultWallets({
  appName: 'GitStake',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'demo-project-id',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
]);

export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };