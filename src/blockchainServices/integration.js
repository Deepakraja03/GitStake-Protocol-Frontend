import { ethers } from 'ethers';

// Import contract artifacts
import EpochPrizePoolArtifact from './artifacts/contracts/EpochPrizePool.sol/EpochPrizePool.json';
import RealAaveIntegrationArtifact from './artifacts/contracts/RealAaveIntegration.sol/RealAaveIntegration.json';
import StakingContractArtifact from './artifacts/contracts/StakingContract.sol/StakingContract.json';
import RewardDistributionArtifact from './artifacts/contracts/RewardDistribution.sol/RewardDistribution.json';
import AaveIntegrationArtifact from './artifacts/contracts/AaveIntegration.sol/AaveIntegration.json';

// Contract addresses on Avalanche Fuji Testnet (Chain ID: 43113)
export const CONTRACT_ADDRESSES = {
  REAL_AAVE_INTEGRATION: '0xe9782b8942D563210C7a36F2B309939A8ae08509',
  STAKING_CONTRACT: '0xDedd1411952ec1FE6d8102fabC98DD8982B8196d',
  REWARD_DISTRIBUTION: '0xa76C8826bf40632836cC00A23dEdF02dd920DadF',
  EPOCH_PRIZE_POOL: '0xbE7BC82d2E16b3d139C96A26a8Ac3d61ce290694',
  MOCK_AAVE_INTEGRATION: '0x97237cF4B21B185Aa181fc69249B5B49630ab74c'
};

// Network configuration
export const NETWORK_CONFIG = {
  CHAIN_ID: 43113, // Avalanche Fuji Testnet
  RPC_URL: 'https://api.avax-test.network/ext/bc/C/rpc',
  BLOCK_EXPLORER: 'https://testnet.snowtrace.io'
};

// Aave V3 configuration (from bgd-labs/aave-address-book)
export const AAVE_CONFIG = {
  POOL_ADDRESSES_PROVIDER: '0x07D04EfAAA0Ac69D19d107795aF247C42Eb50F1C',
  WAVAX_UNDERLYING: '0xd00ae08403B9bbb9124bB305C09058E32C39A48c',
  WETH_GATEWAY: '0x3d2ee1AB8C3a597cDf80273C684dE0036481bE3a',
  POOL: '0x8B9b2AF4afB389b4a70A474dfD4AdCD4a302bb40',
  ORACLE: '0xd36338d0F231446b36008310f1DE0812784ADeBC'
};

// Contract ABIs
export const CONTRACT_ABIS = {
  EpochPrizePool: EpochPrizePoolArtifact.abi,
  RealAaveIntegration: RealAaveIntegrationArtifact.abi,
  StakingContract: StakingContractArtifact.abi,
  RewardDistribution: RewardDistributionArtifact.abi,
  AaveIntegration: AaveIntegrationArtifact.abi
};

/**
 * Get contract instance for EpochPrizePool
 * @param {ethers.Signer} signer - Ethereum signer
 * @returns {ethers.Contract} Contract instance
 */
export const getEpochPrizePoolContract = (signer) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.EPOCH_PRIZE_POOL,
    CONTRACT_ABIS.EpochPrizePool,
    signer
  );
};

/**
 * Get contract instance for RealAaveIntegration
 * @param {ethers.Signer} signer - Ethereum signer
 * @returns {ethers.Contract} Contract instance
 */
export const getRealAaveIntegrationContract = (signer) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.REAL_AAVE_INTEGRATION,
    CONTRACT_ABIS.RealAaveIntegration,
    signer
  );
};

/**
 * Get contract instance for StakingContract
 * @param {ethers.Signer} signer - Ethereum signer
 * @returns {ethers.Contract} Contract instance
 */
export const getStakingContract = (signer) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.STAKING_CONTRACT,
    CONTRACT_ABIS.StakingContract,
    signer
  );
};

/**
 * Get contract instance for RewardDistribution
 * @param {ethers.Signer} signer - Ethereum signer
 * @returns {ethers.Contract} Contract instance
 */
export const getRewardDistributionContract = (signer) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.REWARD_DISTRIBUTION,
    CONTRACT_ABIS.RewardDistribution,
    signer
  );
};

/**
 * Get contract instance for AaveIntegration
 * @param {ethers.Signer} signer - Ethereum signer
 * @returns {ethers.Contract} Contract instance
 */
export const getAaveIntegrationContract = (signer) => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.MOCK_AAVE_INTEGRATION,
    CONTRACT_ABIS.AaveIntegration,
    signer
  );
};

/**
 * GitStake Protocol Service Class
 * Provides high-level interface for interacting with GitStake contracts
 */
export class GitStakeProtocol {
  constructor(signer) {
    this.signer = signer;
    this.epochPrizePool = getEpochPrizePoolContract(signer);
    this.realAaveIntegration = getRealAaveIntegrationContract(signer);
    this.stakingContract = getStakingContract(signer);
    this.rewardDistribution = getRewardDistributionContract(signer);
    this.aaveIntegration = getAaveIntegrationContract(signer);
  }

  /**
   * Deposit AVAX to the current epoch
   * @param {string} amount - Amount in AVAX (will be converted to wei)
   * @returns {Promise<ethers.TransactionResponse>}
   */
  async deposit(amount) {
    const amountWei = ethers.parseEther(amount);
    return await this.epochPrizePool.deposit({ value: amountWei });
  }

  /**
   * Get current epoch information
   * @returns {Promise<Object>} Epoch data
   */
  async getCurrentEpoch() {
    const currentEpochId = await this.epochPrizePool.currentEpochId();
    return await this.epochPrizePool.getEpoch(currentEpochId);
  }

  /**
   * Get user's staking balance for a specific epoch
   * @param {string} userAddress - User's wallet address
   * @param {number} epochId - Epoch ID
   * @returns {Promise<BigNumber>} Staking balance
   */
  async getUserStake(userAddress, epochId) {
    return await this.epochPrizePool.stakeOf(epochId, userAddress);
  }

  /**
   * Submit winners for an epoch (requires backend signature)
   * @param {number} epochId - Epoch ID
   * @param {string[]} winners - Array of winner addresses
   * @param {string} signature - Backend signature
   * @returns {Promise<ethers.TransactionResponse>}
   */
  async submitWinners(epochId, winners, signature) {
    return await this.epochPrizePool.submitWinners(epochId, winners, signature);
  }

  /**
   * Claim prize for a won epoch
   * @param {number} epochId - Epoch ID
   * @returns {Promise<ethers.TransactionResponse>}
   */
  async claim(epochId) {
    return await this.epochPrizePool.claim(epochId);
  }

  /**
   * Trigger epoch close/finalize if conditions are met
   * @returns {Promise<ethers.TransactionResponse>}
   */
  async poke() {
    return await this.epochPrizePool.poke();
  }

  /**
   * Get Aave integration balance
   * @returns {Promise<BigNumber>} Balance in Aave
   */
  async getAaveBalance() {
    return await this.realAaveIntegration.getATokenBalance();
  }

  /**
   * Check if user is a winner for a specific epoch
   * @param {string} userAddress - User's wallet address
   * @param {number} epochId - Epoch ID
   * @returns {Promise<boolean>} True if user is a winner
   */
  async isWinner(userAddress, epochId) {
    try {
      // Check if winners are set for this epoch
      const winnersSet = await this.epochPrizePool.winnersSet(epochId);
      if (!winnersSet) {
        return false; // No winners set yet
      }
      
      // Check if user has any winnings to claim
      const winnings = await this.epochPrizePool.allocationOf(epochId, userAddress);
      return winnings > 0n;
    } catch (error) {
      console.error('Error checking winner status:', error);
      return false;
    }
  }

  /**
   * Get epoch prize amount
   * @param {number} epochId - Epoch ID
   * @returns {Promise<BigNumber>} Prize amount
   */
  async getEpochPrize(epochId) {
    return await this.epochPrizePool.getEpochPrize(epochId);
  }
}

/**
 * Utility function to format AVAX amounts
 * @param {BigNumber} amount - Amount in wei
 * @returns {string} Formatted amount in AVAX
 */
export const formatAVAX = (amount) => {
  return ethers.formatEther(amount);
};

/**
 * Utility function to parse AVAX amounts
 * @param {string} amount - Amount in AVAX
 * @returns {BigNumber} Amount in wei
 */
export const parseAVAX = (amount) => {
  return ethers.parseEther(amount);
};

/**
 * Get transaction URL for Avalanche Fuji testnet
 * @param {string} txHash - Transaction hash
 * @returns {string} Transaction URL
 */
export const getTransactionUrl = (txHash) => {
  return `${NETWORK_CONFIG.BLOCK_EXPLORER}/tx/${txHash}`;
};

// Export all contracts and utilities
export {
  EpochPrizePoolArtifact,
  RealAaveIntegrationArtifact,
  StakingContractArtifact,
  RewardDistributionArtifact,
  AaveIntegrationArtifact
};

// Default export
export default GitStakeProtocol;