import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { http } from 'viem';
import {
  metaMaskWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
  coreWallet,
} from '@rainbow-me/rainbowkit/wallets';

export const wagmiConfig = getDefaultConfig({
  appName: 'GitStake Protocol',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2f5a8b3c9e1d7f4a6b8c0e2f5a8b3c9e',
  chains: [avalanche, avalancheFuji],
  transports: {
    [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
  },
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [
        coreWallet,
        metaMaskWallet,
        walletConnectWallet,
        coinbaseWallet,
        rainbowWallet,
        trustWallet,
      ],
    },
  ],
});

export const chains = [avalanche, avalancheFuji];
